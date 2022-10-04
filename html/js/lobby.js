

import {scrollTo, initBasic} from './elementHelpers.js'
import {setupSocketUI} from './socketHelpers.js'




var env = {}

env.players = [];
initBasic();




var socket = io({
	autoConnect: true
	});

setupSocketUI(socket,env);


scrollTo(0,0);




