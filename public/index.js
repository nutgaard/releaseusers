var el = Sink.createElement;
var source = new Source(document);
var api = new Api();

function dataloadRenderer(error, data) {
    if (error) {
        return el('h2', {}, 'Error while loading context data...');
    }

    var me = data[0];
    var departments = data[1].departments;

    return [
        el('p', {},
            el('b', {}, 'You: '),
            el('span', {}, me.id + ' ' + me.name)
        ),
        el('div', {},
            el('b', {}, 'Departments: '),
            departments.map(function (department) {
                return department.id + ' ' + department.name
            }).join(', ')
        ),
        el('div', {},
            el('h2', {}, 'Get users'),
            departments.map(function (department) {
                return el(
                    'button',
                    {
                        'class': 'depBtn',
                        'data-departmentid': department.id,
                        'data-departmentname': department.name
                    },
                    department.id + ' ' + department.name
                );
            })
        )
    ];
}

function usersRenderer(error, data) {
    if (error) {
        return el('h2', {}, 'Error while loading users...');
    }

    return [
        el('h2', {}, 'Users from ' + data.department.id + ' ' + data.department.name),
        el('table', {},
            el('thead', {},
                el('tr', {},
                    el('th', {}, 'Id'),
                    el('th', {}, 'Name'),
                    el('th', {}, 'Department'),
                    el('th', {}, 'Release')
                )
            ),
            el('tbody', {},
                data.users.map(function (user) {
                    return el('tr', {},
                        el('td', {}, user.id),
                        el('td', {}, user.name),
                        el('td', {}, data.department.id + ' ' + data.department.name),
                        el(
                            'button',
                            {
                                'class': 'releaseBtn',
                                'data-userid': user.id
                            },
                            'Release'
                        )
                    );
                })
            )
        )
    ];
}

function dataloadHandler(data, error) {
    let container = document.querySelector('.dataload');
    if (error) {
        Sink.of(dataloadRenderer(error, null)).into(container);
    } else {
        Sink.of(dataloadRenderer(null, data)).into(container);
    }

}

function usersHandler(data, error) {
    let container = document.querySelector('.users');
    if (error) {
        Sink.of(usersRenderer(error, null)).into(container);
    } else {
        Sink.of(usersRenderer(null, data)).into(container);
    }
}

source.listen('dataload_ERROR', dataloadHandler);
source.listen('dataload_OK', dataloadHandler);
source.listen('users_ERROR', usersHandler);
source.listen('users_OK', usersHandler);

source.listen('click', Source.Event.matches('.depBtn', function (event) {
    var departmentid = event.target.dataset.departmentid;
    var departmentname = event.target.dataset.departmentname;

    source.fromPromise('users',
        api.users(event.target.dataset.departmentid)
            .then(function (users) {
                return {
                    department: {
                        id: departmentid,
                        name: departmentname
                    },
                    users: users
                }
            })
    );
}));

source.listen('click', Source.Event.matches('.releaseBtn', function (event) {
    var userid = event.target.dataset.userid;

    console.log('releasing user ', userid);
}));

source.listen('DOMContentLoaded', function () {
    source.fromPromise('dataload', Promise.all([api.whoami(), api.departments()]));
});