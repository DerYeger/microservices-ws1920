import Service from './service';
import ModelService from './model-service';

export default class DateService implements Service {
    model: ModelService;

    private dateMillis = 0;

    constructor() {
    }

    getDate(): string {
        let time = new Date().getTime();
        if (this.dateMillis >= time) {
            time = this.dateMillis + 1;
        }
        this.dateMillis = time;
        return new Date(time).toISOString();
    }
}
