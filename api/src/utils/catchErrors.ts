export const catchAsyncErrors = <T>(callback: () => T): T => {
    try {
        return callback();
    } catch (e) {
        // eslint-disable-next-line no-console
        console.error(e);
    }
};
