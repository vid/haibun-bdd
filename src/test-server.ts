
import { actionOK, getFromRuntime, } from '@haibun/core/build/lib/util';

import { IRequest, IResponse, IWebServer, TRequestHandler, WEBSERVER } from '@haibun/web-server-express/build/defs';
import { IExtensionConstructor, IStepper, TNamed, TWorld } from '@haibun/core/build/lib/defs';

const TALLY = 'tally';

const TestRoute: IExtensionConstructor = class TestRoute implements IStepper {
    world: TWorld;
    constructor(world: TWorld) {
        this.world = world;
    }
    route: TRequestHandler = (req: IRequest, res: IResponse) => {
        this.world.shared.set(TALLY, `${(parseInt(this.world.shared.get(TALLY), 10) || 0) + 1}`);
        this.world.logger.log(`tally ${this.world.shared.get(TALLY)}`);

        res.status(200).send(`${this.world.shared.get(TALLY)}`);
    }

    steps = {
        addRoute: {
            gwta: 'start test route at {loc}',
            action: async ({ loc }: TNamed) => {
                let webserver: IWebServer = getFromRuntime(this.world.runtime, WEBSERVER);

                await webserver.addRoute('get', loc, this.route);
                return actionOK();
            },
        },
    };
};

export default TestRoute;