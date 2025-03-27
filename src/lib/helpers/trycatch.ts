interface Success<T> {
	data: T;
	error?: never;
}

interface Failure<E> {
	data?: never;
	error: E;
}

type SafeResult<T, E = Error> = Success<T> | Failure<E>;

export async function tryCatch<T, E = Error>(promise: Promise<T>): Promise<SafeResult<T, E>> {
	try {
		const data = await promise;
		return { data };
	} catch (error) {
		return { error: error as E };
	}
}
