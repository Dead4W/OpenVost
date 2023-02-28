function b642ab(base64_string){
    return Uint8Array.from(window.atob(base64_string), c => c.charCodeAt(0));
}

function str2ab(str) {
    const buf = new ArrayBuffer(str.length);
    const bufView = new Uint8Array(buf);
    for (let i = 0, strLen = str.length; i < strLen; i++) {
        bufView[i] = str.charCodeAt(i);
    }
    return buf;
}

var messageString = "The quick brown fox jumps over the lazy dog";
var encodedMessage = new TextEncoder().encode(messageString);

var publicKeyStr = "MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAunF5aDa6HCfLMMI/MZLT5hDk304CU+ypFMFiBjowQdUMQKYHZ+fklB7GpLxCatxYJ/hZ7rjfHH3Klq20/Y1EbYDRopyTSfkrTzPzwsX4Ur/l25CtdQldhHCTMgwf/Ev/buBNobfzdZE+Dhdv5lQwKtjI43lDKvAi5kEet2TFwfJcJrBiRJeEcLfVgWTXGRQn7gngWKykUu5rS83eAU1xH9FLojQfyia89/EykiOO7/3UWwd+MATZ9HLjSx2/Lf3g2jr81eifEmYDlri/OZp4OhZu+0Bo1LXloCTe+vmIQ2YCX7EatUOuyQMt2Vwx4uV+d/A3DP6PtMGBKpF8St4iGwIDAQAB";
// var privateKeyStr = "MIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQC6cXloNrocJ8swwj8xktPmEOTfTgJT7KkUwWIGOjBB1QxApgdn5+SUHsakvEJq3Fgn+FnuuN8cfcqWrbT9jURtgNGinJNJ+StPM/PCxfhSv+XbkK11CV2EcJMyDB/8S/9u4E2ht/N1kT4OF2/mVDAq2MjjeUMq8CLmQR63ZMXB8lwmsGJEl4Rwt9WBZNcZFCfuCeBYrKRS7mtLzd4BTXEf0UuiNB/KJrz38TKSI47v/dRbB34wBNn0cuNLHb8t/eDaOvzV6J8SZgOWuL85mng6Fm77QGjUteWgJN76+YhDZgJfsRq1Q67JAy3ZXDHi5X538DcM/o+0wYEqkXxK3iIbAgMBAAECggEASlJj0ExIomKmmBhG8q8SM1s2sWG6gdQMjs6MEeluRT/1c2v79cq2Dum5y/+UBl8x8TUKPKSLpCLs+GXkiVKgHXrFlqoN+OYQArG2EUWzuODwczdYPhhupBXwR3oX4g41k/BsYfQfZBVzBFEJdWrIDLyAUFWNlfdGIj2BTiAoySfyqmamvmW8bsvc8coiGlZ28UC85/Xqx9wOzjeGoRkCH7PcTMlc9F7SxSthwX/k1VBXmNOHa+HzGOgO/W3k1LDqJbq2wKjZTW3iVEg2VodjxgBLMm0MueSGoI6IuaZSPMyFEM3gGvC2+cDBI2SL/amhiTUa/VDlTVw/IKbSuar9uQKBgQDd76M0Po5Lqh8ZhQ3obhFqkfO5EBXy7HUL15cw51kVtwF6Gf/J2HNHjwsg9Nb0eJETTS6bbuVd9bn884JoRS986nVTFNZ4dnjEgKjjQ8GjfzdkpbUxsRLWiIxuOQSpIUZGdMi2ctTTtspvMsDsjRRYdYIQCe/SDsdHGT3vcUCybwKBgQDXDz6iVnY84Fh5iDDVrQOR4lYoxCL/ikCDJjC6y1mjR0eVFdBPQ4j1dDSPU9lahBLby0VyagQCDp/kxQOl0z2zBLRI4I8jUtz9/9KW6ze7U7dQJ7OTfumd5I97OyQOG9XZwKUkRgfyb/PAMBSUSLgosi38f+OC3IN3qlvHFzvxFQKBgQCITpUDEmSczih5qQGIvolN1cRF5j5Ey7t7gXbnXz+Umah7kJpMIvdyfMVOAXJABgi8PQwiBLM0ySXo2LpARjXLV8ilNUggBktYDNktc8DrJMgltayaj3HNd2IglD5rjfc2cKWRgOd7/GlKcHaTEnbreYhfR2sWrWLxJOyoMfuVWwKBgFalCbMV6qU0LfEo8aPlBN8ttVDPVNpntP4h0NgxPXgPK8Pg+gA1UWSy4MouGg/hzkdHaj9ifyLlCX598a5JoT4S0x/ZeVHd/LNI8mtjcRzD6cMde7gdFbpLb5NSjIAyrsIAX4hxvpnqiOYRePkVIz0iLGziiaMbfMwlkrxvm/LRAoGBALPRbtSbE2pPgvOHKHTGPr7gKbmsWVbOcQA8rG801T38W/UPe1XtynMEjzzQ29OaVeQwvUN9+DxFXJ6Yvwj6ih4Wdq109i7Oo1fDnMczOQN9DKch2eNAHrNSOMyLDCBm++wbyHAsS2T0VO8+gzLABviZm5AFCQWfke4LZo5mOS10";

const publicKey = await window.crypto.subtle.importKey("spki", str2ab(window.atob(publicKeyStr)), { name: "RSA-PSS", hash: { name: "SHA-256" } }, false, ["verify"]);
// const privateKey = await window.crypto.subtle.importKey("pkcs8", str2ab(window.atob(privateKeyStr)), { name: "RSA-PSS", hash: { name: "SHA-256" } }, false, ["sign"]);

// const sign = await window.crypto.subtle.sign({name: "RSA-PSS", saltLength: 32}, privateKey, encodedMessage);
// console.log(b642ab(new Uint8Array(sign)));
// const signature = window.btoa(String.fromCharCode.apply(null, [...new Uint8Array(sign)])); //the way said signature is stored and I can load it
const res = await window.crypto.subtle.verify({name: "RSA-PSS", saltLength: 32}, publicKey, b642ab(signature), encodedMessage);
console.log("Verifying:", /*signature, publicKey,*/ res);
