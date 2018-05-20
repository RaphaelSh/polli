export default function () {

        let content = ['username','email', 'password','psConfirm', 'email_login','password_login'];
        
        let { errors, isFocused } = this.state;
        
        const arr_from_obj = obj => {
            const [ name, keys ] = Object.entries(obj)[0];
            return Object.keys(keys).map( key => `${name}.${key}`);
        };
        
        let newErrors = arr_from_obj({ errors }), newisFocused = arr_from_obj({ isFocused });
        content = content.concat(newErrors, newisFocused);
        
        const clear_single_content = content => new Promise ((res, rej )=> {
                this.interval = setTimeout(() => {
                    const callback = () => {
                        clearInterval(this.interval);
                        res(content);
                    }
                    if (/\./g.test(content)) {
                        let contents = content.split('.'), [key, value] = contents,
                        param = this.state[key];
                        param[value] = key === 'errors' ? '' : false;
                        this.setState({ [key]:param },callback)
                    }
                    else { this.setState( {[content]:''}, callback ); }
                },60)
        });
        
       
        const clear_all_content = contents => contents.length && new Promise ( (res,rej) => {
            clear_single_content(contents[0])
                .then(res => clear_all_content( contents.filter( item => item !== res )));
        });
        
        
        clear_all_content(content);
}