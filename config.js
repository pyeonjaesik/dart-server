//52.79.242.96
module.exports = {
	server_port: 3000,
	db_url: 'mongodb://localhost:27017/190613',
	db_schemas: [
	    {file:'./user_schema', collection:'user', schemaName:'UserSchema', modelName:'UserModel'},
        {file:'./tk_schema', collection:'tk', schemaName:'TkSchema', modelName:'TkModel'},
        {file:'./post_schema', collection:'post', schemaName:'PostSchema', modelName:'PostModel'},
        {file:'./ms_schema', collection:'ms', schemaName:'MsSchema', modelName:'MsModel'},
        {file:'./lv_schema', collection:'lv', schemaName:'LvSchema', modelName:'LvModel'},
        {file:'./coin_schema', collection:'coin', schemaName:'CoinSchema', modelName:'CoinModel'},
        {file:'./mct_schema', collection:'mct', schemaName:'MctSchema', modelName:'MctModel'},
        {file:'./alarm_schema', collection:'alarm', schemaName:'AlarmSchema', modelName:'AlarmModel'},
        {file:'./exchange_schema', collection:'exchange', schemaName:'ExchangeSchema', modelName:'ExchangeModel'},
	],
	route_info: [
        {file:'./user',path:'/login', method:'login', type:'post'}
        ,{file:'./cert',path:'/cert',method:'cert',type:'post'}
        ,{file:'./signup',path:'/signup',method:'signup', type:'post'}
        ,{file:'./faketoken',path:'/faketoken',method:'faketoken', type:'post'}
        ,{file:'./mypost',path:'/mypost',method:'mypost', type:'post'}
        ,{file:'./getmainpost',path:'/getmainpost',method:'getmainpost', type:'post'}
        ,{file:'./getmainpost2',path:'/getmainpost2',method:'getmainpost2', type:'post'}
        ,{file:'./getmainpostp',path:'/getmainpostp',method:'getmainpostp', type:'post'}
        ,{file:'./getunipost',path:'/getunipost',method:'getunipost', type:'post'}
        ,{file:'./onepost',path:'/onepost',method:'onepost', type:'post'}
        ,{file:'./oneposta2',path:'/oneposta2',method:'oneposta2', type:'post'}
        ,{file:'./oneposta3',path:'/oneposta3',method:'oneposta3', type:'post'}
        ,{file:'./oneposta4',path:'/oneposta4',method:'oneposta4', type:'post'}
        ,{file:'./onepostc',path:'/onepostc',method:'onepostc', type:'post'}
        ,{file:'./mymission',path:'/mymission',method:'mymission', type:'post'}
        ,{file:'./start',path:'/start',method:'start', type:'post'}
        ,{file:'./love1',path:'/love1',method:'love1', type:'post'}
        ,{file:'./love2',path:'/love2',method:'love2', type:'post'}
        ,{file:'./love11',path:'/love11',method:'love11', type:'post'}
        ,{file:'./love22',path:'/love22',method:'love22', type:'post'}
        ,{file:'./makemct',path:'/makemct',method:'makemct', type:'post'}
        ,{file:'./getcoin',path:'/getcoin',method:'getcoin', type:'post'}
        ,{file:'./mscp',path:'/mscp',method:'mscp', type:'post'}
        ,{file:'./alarm',path:'/alarm',method:'alarm', type:'post'}
        ,{file:'./msnt0',path:'/msnt0',method:'msnt0', type:'post'}
        ,{file:'./getmypost',path:'/getmypost',method:'getmypost', type:'post'}
        ,{file:'./getcoinpost',path:'/getcoinpost',method:'getcoinpost', type:'post'}
        ,{file:'./chtk',path:'/chtk',method:'chtk', type:'post'}
        ,{file:'./push',path:'/push',method:'push', type:'post'}
        // ,{file:'./fblogin',path:'/fblogin',method:'fblogin', type:'post'}
        ,{file:'./signupfb',path:'/signupfb',method:'signupfb', type:'post'}
        ,{file:'./signupkit',path:'/signupkit',method:'signupkit', type:'post'}
        ,{file:'./setnickfb',path:'/setnickfb',method:'setnickfb', type:'post'}
        ,{file:'./setnickkit',path:'/setnickkit',method:'setnickkit', type:'post'}
        ,{file:'./setpwfb',path:'/setpwfb',method:'setpwfb', type:'post'}
        ,{file:'./setpwkit',path:'/setpwkit',method:'setpwkit', type:'post'}
        ,{file:'./verifypw',path:'/verifypw',method:'verifypw', type:'post'}
        ,{file:'./verifyfb',path:'/verifyfb',method:'verifyfb', type:'post'}
        ,{file:'./verifykit',path:'/verifykit',method:'verifykit', type:'post'}
        ,{file:'./alarmflush',path:'/alarmflush',method:'alarmflush', type:'post'}
        ,{file:'./paymentcomplete',path:'/payments/complete',method:'paymentcomplete', type:'post'}
        ,{file:'./exchange',path:'/exchange',method:'exchange', type:'post'}
	]
}