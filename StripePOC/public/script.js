const button = document.querySelector('button');
button.addEventListener('click', () => {
    fetch('/create-checkout-session', {
        method: 'POST',
        headers: {
            'content-type': 'application/json',
        },
        body: JSON.stringify({
            // Send the dishId & quantity of dishes in the body
            items: [
                { id: 1, quantity: 4 },
                { id: 2, quantity: 2 },
                { id: 4, quantity: 1 },
            ]
        })
    }).then(res => {
        if (res.ok) return res.json()
        return res.json().then(json => Promise.reject(json));
    }).then(({ url }) => {
        window.location = url;
    }).catch(e => console.error(e.error));
})