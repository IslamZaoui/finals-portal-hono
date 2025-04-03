import { tryCatch } from '@/lib/helpers/trycatch';
import { sha1 } from '@oslojs/crypto/sha1';
import { encodeHexLowerCase } from '@oslojs/encoding';

export async function hashPassword(password: string): Promise<string> {
	return await Bun.password.hash(password, {
		algorithm: 'argon2id',
		memoryCost: 19456,
		timeCost: 2
	});
}

export async function verifyPasswordHash(hash: string, password: string): Promise<boolean> {
	return await Bun.password.verify(password, hash);
}

export async function isPasswordStrong(password: string): Promise<boolean> {
	const hash = encodeHexLowerCase(sha1(new TextEncoder().encode(password)));
	const hashPrefix = hash.slice(0, 5);

	const { data, error } = await tryCatch(
		(async () => {
			const response = await fetch(`https://api.pwnedpasswords.com/range/${hashPrefix}`);
			if (!response.ok) {
				throw new Error('HTTP error');
			}
			return response.text();
		})()
	);

	if (error) {
		console.error('Error checking password strength:', error);
		return true;
	}

	const items = data.split('\n');
	for (const item of items) {
		const hashSuffix = item.slice(0, 35).toLowerCase();
		if (hash === hashPrefix + hashSuffix) {
			return false;
		}
	}
	return true;
}
