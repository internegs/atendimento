export function searchLowers(list, quantity) {
    return list.reduce((acc, val) => {
        if (acc.length < quantity) {
            acc.push(val)
            acc.sort((a, b) => a - b)
        } else if (val < acc[acc.length - 1]) {
            acc[acc.length - 1] = val
            acc.sort((a, b) => a - b)
        }

        return acc
    }, [])
}
