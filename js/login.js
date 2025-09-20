document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const form = e.target;
    const data = {
        user_admin: form.user_admin.value,
        password: form.password.value
    };

    const res = await fetch('http://localhost:3100/login', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(data)
    });

    const result = await res.json();
    document.getElementById('message').textContent = result.message;

    if (result.success) {
        window.location.href = 'index.html'
    }
    console.log(data);
});

const togglePass = document.getElementById('togglePass');
const inputPassword = document.getElementById('password');
const iconEye =  document.getElementById('iconEye');

togglePass.addEventListener('click', () => {
    const isPassword = inputPassword.type === 'password';
    inputPassword.type = isPassword ? 'text' : 'password';

    iconEye.classList.toggle('fa-eye');
    iconEye.classList.toggle('fa-eye-slash');
});