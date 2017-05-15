(function () {
    function createUser(dep, name) {
        return {
            id: dep + name.length,
            name: name + ' ' + dep
        };
    }

    function Api() {

    }

    Api.prototype.whoami = function () {
        return Promise.resolve({ id: 'I12345', name: 'The handler' });
    };
    Api.prototype.departments = function () {
        return Promise.resolve({ departments: [{ id: '0001', name: 'Dep1' }, { id: '0002', name: 'Dep2' }] });
    };
    Api.prototype.users = function (department) {
        return Promise.resolve([
            createUser(department, 'Ryan'),
            createUser(department, 'Peter'),
            createUser(department, 'Susanne')
        ]);
    };


    window.Api = Api;
})();