function doLogin() {
    let token = window.localStorage.getItem('token');
    if (token) {
        return Promise.resolve({})
    }
    let [, search] = window.location.search.split('?');
    let arr = search ? search.split('&') : [];
    let param = arr.reduce(function (total, item) {
        let [key, value] = item.split('=')
        total[key] = value;
        return total;
    }, {});
    let { ssoToken, ...query } = param;
    let queryString = Object.keys(query).reduce(function (total, key, index, arr) {
        return total += `${key}=${query[key]}` + (index >= arr.length - 1 ? '' : '&');
    }, '')
    let href = `${window.location.origin}${queryString && ('?' + queryString)}`;
    if (!ssoToken) {
        window.localStorage.removeItem('token');
        window.localStorage.removeItem('user');
        window.location.href = `http://sso.uyue.club:9601/login?serviceURL=${href}`
    } else {
        return new Promise(function (resolve, reject) {
            let params = `ssoToken=${ssoToken}&serviceURL=${href}`;
            var xhr = window.XMLHttpRequest
                ? new XMLHttpRequest()
                : new Window.ActiveXObject("Microsoft.XMLHTTP");
            xhr.onreadystatechange = function () {
                if (xhr.readyState == 4 && xhr.status == 200) {
                    let response = JSON.parse(xhr.responseText)
                    let { token, user, redirectURL } = response.data;
                    window.localStorage.setItem('token', token)
                    window.localStorage.setItem('user', JSON.stringify(user))
                    if (redirectURL) {
                        window.location.href = redirectURL;
                    }
                    resolve(response.data)
                }
                if (xhr.readyState == 4 && xhr.status == 401) {
                    window.localStorage.removeItem('token');
                    window.localStorage.removeItem('user');
                    window.location.href = `http://sso.uyue.club:9601/login?serviceURL=${href}`
                }
                if (xhr.readyState == 4 && xhr.status != 200) {
                    reject(new Error("server error"))
                }
            }
            xhr.open("POST", "/sso/doLogin", true);
            xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
            xhr.send(params);
        })
    }
}
export default doLogin;