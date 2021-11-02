import Ledgers from 'container/ledgers';

export default [
    {
        path: '/', name: '账户管理页', component: Ledgers, exact: true, render: () => {
            console.log(123)
        }
    },
];
