const passwordParse = (password) => {

    const isValidPassword = /^[A-Za-z0-9_]+$/.test(password)

    if (isValidPassword)
        return true
    return false

}

export default passwordParse