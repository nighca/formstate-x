/**
 * @file setup test env
 * @author nighca <nighca@live.cn>
 */
import { configure, spy } from 'mobx';
configure({ enforceActions: 'observed' });
// use `debug=true npx jest ...` to enable action log
if (process.env.debug) {
    var startAt_1 = Date.now();
    spy(function (event) {
        if (event.type === 'action') {
            var actionAt = formatTime(Date.now() - startAt_1);
            var argsInfo = (event.arguments && event.arguments.length > 0
                ? "args: " + event.arguments.join(', ')
                : 'no args');
            console.log(actionAt + " " + event.name + " with " + argsInfo);
        }
    });
}
function formatTime(timeInMs) {
    var part1 = ('00' + Math.floor(timeInMs / 1000)).slice(-2);
    var part2 = (timeInMs % 1000 + '000').slice(0, 3);
    return part1 + ':' + part2;
}
//# sourceMappingURL=testSetup.js.map