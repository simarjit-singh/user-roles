const express = require('express');
const User = require('./models/user');
const Role = require('./models/role');
const app = express();
app.use(express.json());

const users = [
    new User(1, 'test', 'test@test.com', [])
];

const roles = [
    new Role(1, 'admin')
];

app.get('/api/v1/users', (req, res) => {
    res.send(users);
});

app.get('/api/v1/users/:id', (req, res) => {
    const user = users.find(user => user.id === parseInt(req.params.id));
    if (!user) return res.status(404).send('User not found.');
    res.send(user);
});

app.post('/api/v1/users', (req, res) => {
    let userRoles = [];
    for (const role of JSON.parse(req.body.roles)) {
        userRoles.push(roles.find(r => r.id === role));
    }
    const user = new User(users.length + 1, req.body.name, req.body.email, userRoles);
    users.push(user);
    res.status(201).send();
});

app.put('/api/v1/users/:id', (req, res) => {
    const user = users.find(user => user.id === parseInt(req.params.id));
    if (!user) return res.status(404).send('User not found.');
    if (req.body.roles) {
        let userRoles = [];
        for (const roleId of JSON.parse(req.body.roles)) {
            userRoles.push(roles.find(role => role.id === roleId));
        }
        user.roles = userRoles;
    }
    if (req.body.name) {
        user.name = req.body.name;
    }
    if (req.body.email) {
        user.email = req.body.email;
    }
    res.status(204).send();
});

app.delete('/api/v1/users/:id', (req, res) => {
    const userIndex = users.findIndex(user => user.id === parseInt(req.params.id));
    if (userIndex === -1) return res.status(404).send('User not found.');
    users.splice(userIndex, 1);
    res.status(204).send();
});

app.get('/api/v1/roles', (req, res) => {
    res.send(roles);
});

app.get('/api/v1/roles/:id', (req, res) => {
    const role = roles.find(role => role.id === parseInt(req.params.id));
    if (!role) return res.status(404).send('Role not found.');
    res.send(role);
});

app.post('/api/v1/roles', (req, res) => {
    const role = new Role(roles.length + 1, req.body.name);
    roles.push(role);
    res.status(201).send();
});

app.put('/api/v1/roles/:id', (req, res) => {
    const role = roles.find(role => role.id === parseInt(req.params.id));
    if (!role) return res.status(404).send('Role not found.');
    if (req.body.name) {
        role.name = req.body.name;
    }
    for (let user of users) {
        const userRoleIndex = user.roles.findIndex(r => r.id === role.id);
        user.roles[userRoleIndex] = role;
    }
    res.status(204).send();
});

app.delete('/api/v1/roles/:id', (req, res) => {
    const roleIndex = roles.findIndex(role => role.id === parseInt(req.params.id));
    if (roleIndex === -1) return res.status(404).send('Role not found.');
    const role = roles[roleIndex];
    roles.splice(roleIndex, 1);
    for (let user of users) {
        const userRoleIndex = user.roles.findIndex(r => r.id === role.id);
        user.roles.splice(userRoleIndex, 1);
    }
    res.status(204).send();
});


app.listen(3000, () => console.log('Listening on port 3000...'));