
export default function (url: RequestInfo, options?: RequestInit, timeout = 30000): Promise<any> {
    return Promise.race([
        fetch(url, options),
        new Promise((_, reject) =>
            setTimeout(() => reject(new TimeoutError()), timeout)
        )
    ]);
}

export class TimeoutError extends Error {
    constructor() {
        super('Request time out');
    }
}