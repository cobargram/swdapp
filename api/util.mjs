export class App {
    static rand(target = 36){
        return Math.random().toString(target).substr(2); // remove `0.`
    };

    static token() {
        return App.rand() + App.rand();
    };

    
}

const env = {
    db: {
        host: 'localhost',
        user: 'root',
        password: '',
        name: 'swapp_db'
        // indicatedinpassing345#.
    },
    nurses: [
        {
            email: 'sandra@gmail.com',
            name: 'sandra',
            password: 'coveredinpassworded3421'
        },
        {
            email: 'quadri@gmail.com',
            name: 'quadri',
            password: 'coveredinpassworded3421'
        },
        {
            email: 'beatrice@gmail.com',
            name: 'beatrice',
            password: 'coveredinpassworded3421'
        },
    ],
    default_patient: {
        email: 'oyeb@gmail.com',
        name: 'oye',
        password: 'passworded'
    },
    session: {
        secret: App.token()
    }
}

export default env;