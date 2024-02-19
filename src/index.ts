import os from 'os';
export default (() => {
    const hostname = os.hostname();
    console.log("Hello via Bun! from hostname: ", hostname);
    return;
})();