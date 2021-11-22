// Examples of loops which are caught or not caught by the plugin transformer.
// You can verify this behavior by commenting/uncommenting the iteration blocks.

export async function setupPlugin({ global }) {
    console.log('Setting up the plugin')
    const range = [...new Array(5e5).keys()]
    const object = Object.fromEntries(range.map(i => [i, i]))
    global.range = range
    global.object = object
}

export async function runEveryMinute({ global: { range, object } }) {
    console.log('Run every minute called')
    const start = new Date().valueOf()

    // The below loop fails
    for (let i = 0; i < range.length; i++) {
        const now = new Date().valueOf()
        console.log({ i, elapsed: now - start, method: 'for-plusplus' })
        try {
            await fetch('http://localhost:8000/_health')
        } catch (e) {
            console.error(e)
        }
    }

    // The below loop fails
    let i = 0
    while (i < range.length) {
        const now = new Date().valueOf()
        console.log({ i, elapsed: now - start, method: 'while' })
        try {
            await fetch('http://localhost:8000/_health')
        } catch (e) {
            console.error(e)
        }
    }

    // The below loop does not fail
    for (const i of range) {
        const now = new Date().valueOf()
        console.log({ i, elapsed: now - start, method: 'for-of' })
        try {
            await fetch('http://localhost:8000/_health')
        } catch (e) {
            console.error(e)
        }
    }

    // The below loop does not fail
    for (const property in object) {
        const now = new Date().valueOf()
        console.log({ property, elapsed: now - start, method: 'for-in' })
        try {
            await fetch('http://localhost:8000/_health')
        } catch (e) {
            console.error(e)
        }
    }
}
