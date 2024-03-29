const params = new Proxy(new URLSearchParams(window.location.search), {
	get: (searchParams, prop) => searchParams.get(prop),
});
let isError = params.error;

console.log(isError);

if (isError) {
	document.querySelector(".message").innerHTML = `<p> Błędne hasło! </p>`;
}

function login() {
	let password = SHA512(document.querySelector("#form-password").value);
	console.log(password);
	document.cookie = `password=${password}; path=/;`;
	window.location.replace("/admin/panel");
}

let loginBtn = document.querySelector("#form-login-btn");
loginBtn.addEventListener("click", (event) => {
	event.preventDefault();
	login();
});
