class Randomaizer {
    static getRandom(min, max) {
        return Math.round(min + Math.random() * (max - min));
    }
}


class TamagDto {
    constructor(statValue, statName, actionName) {
       this.statValue = statValue;
       this.name = statName;
       this.actionName = actionName;
    }
}

class TimerDto {
    constructor(startDate) {
        let newDate = new Date(new Date() - startDate);
        this.seconds = newDate.getSeconds();
        this.minutes = newDate.getMinutes();
    }
}


class TamagModel {
    static get DEFAULT_MIN_STAT() { return 50 };
    static get DEFAULT_MAX_STAT() { return 70 };

    static get EAT_FUNC_NAME()   { return 'eat' };
    static get HAPPY_FUNC_NAME() { return 'happy' };
    static get CLEAN_FUNC_NAME() { return 'clean' };

    constructor(maxStat = TamagModel.DEFAULT_MAX_STAT) {
        this.maxStat = maxStat;

        this.eatStat = Randomaizer.getRandom(TamagModel.DEFAULT_MIN_STAT, maxStat);
        this.cleanStat = Randomaizer.getRandom(TamagModel.DEFAULT_MIN_STAT, maxStat);
        this.happyStat = Randomaizer.getRandom(TamagModel.DEFAULT_MIN_STAT, maxStat);
    }

    executeAction(action) {
        switch (action) {
            case TamagModel.EAT_FUNC_NAME:
                return this._eat();
            case TamagModel.HAPPY_FUNC_NAME:
                return this._happy();
            case TamagModel.CLEAN_FUNC_NAME:
                return this._clean();
            default:
                new Error('Unsupported tamag action name')
        }
    }

    getStats() {
        return [
            new TamagDto(this.eatStat, 'Eat', TamagModel.EAT_FUNC_NAME ),
            new TamagDto(this.happyStat, 'Happy', TamagModel.HAPPY_FUNC_NAME ),
            new TamagDto(this.cleanStat, 'Clean', TamagModel.CLEAN_FUNC_NAME ),
        ]
    }

    isTamagDead() {
        return !!this.getStats().find((statDto) => statDto.statValue < 0)
    }

    decreaseStatsBy(num) {
        this.eatStat -= num;
        this.happyStat -= num;
        this.cleanStat -= num;
    }

    _eat() {
        this.eatStat = this._assignStat(this.eatStat, 30);
        this.cleanStat -= 30;
    }

    _clean() {
        this.cleanStat = this._assignStat(this.cleanStat, 40);
        this.happyStat -= 20;
    }

    _happy() {
        this.happyStat = this._assignStat(this.happyStat, 15);
        this.eatStat -= 10;
    }

    _assignStat(stat, increaseBy) {
        let result = stat + increaseBy;
        return (result > this.maxStat) ? this.maxStat : result
    }
}

class TamagView {
    constructor(elem) {
        this.elem = elem;
    };

    setActionHandler(action) {
        this.action = action;
    }

    // @param statsDtos Array <TeamDto>
    // @param timerDto [TimerDto]
    renderGame(statsDtos, timerDto) {
        this.elem.innerHTML = null;

        statsDtos.forEach((statProps) => {
            let container = document.createElement('div');
            container.style.display = 'flex';

            let statName = document.createElement('p');
            statName.innerHTML = statProps.name;

            let statValueElem = document.createElement('p');
            statValueElem.innerHTML = '        . . . .   ' + statProps.statValue + ' . . . ';

            let actionButton = document.createElement('button');
            actionButton.innerHTML = statProps.actionName;
            actionButton.addEventListener('click', () => {
                this.action(statProps.actionName)
            });

            container.appendChild(statName);
            container.appendChild(statValueElem);
            container.appendChild(actionButton);

            this.elem.appendChild(container)
        });

        let timer = document.createElement('p');
        timer.innerHTML = timerDto.minutes + ' : ' +  timerDto.seconds;

        this.elem.appendChild(timer)
    }
}


class TamgControllerAbstract{
    constructor(temagView, tamagModel, main) {
        this.temagView = temagView;
        this.tamagModel = tamagModel;

        this.main = main;

        this.temagView.setActionHandler(this.executeAction.bind(this));

        this.startTime = new Date();

        this._initTimer();
        this._initStatsDecreasing();
    }

    render() { this._renderGame() };

    executeAction(action) {
        this.tamagModel.executeAction(action);
        this._renderGame();
    }

    _initTimer() {
        this.timerId = setInterval(() => {
            this._renderGame();
        }, 1000)
    };

    _initStatsDecreasing() {
        this.decreaseStatsId =  setInterval(() => {
            this._decreaseStats();

            this._renderGame();
        }, 5000)
    };

    _renderGame() {
        if (this.tamagModel.isTamagDead()) return this._gameOver();

        this.temagView.renderGame(
            this._getTamagStats(),
            new TimerDto(this.startTime)
        );
    }

    _getTamagStats() {
        return this.tamagModel.getStats()
    }

    _gameOver() {
        clearInterval(this.timerId);
        clearInterval(this.decreaseStatsId);
        this.main.changeState(new GameOverState(this.main))
    }

    _decreaseStats() {
        new Error('not implemented')
    }
}

class TamagLazyController extends TamgControllerAbstract {
    _decreaseStats() {
        this.tamagModel.decreaseStatsBy(5);
    }
}

class TamagHardcoreController extends TamgControllerAbstract{
    _decreaseStats() {
        this.tamagModel.decreaseStatsBy(3);
    }
}


class TamagFactory {
    static get LAZY_TYPE() { return 'lazy' };
    static get HARDCORE_TYPE() { return 'hardcore' };

    static get TAMAG_TYPES() { return [TamagFactory.LAZY_TYPE, TamagFactory.HARDCORE_TYPE] }

    static getGameByType(type, main) {
        let tamagView = new TamagView(main.getRootElem());

        switch (type) {
            case TamagFactory.LAZY_TYPE:
                return new TamagLazyController(tamagView, new TamagModel(), main);
            case TamagFactory.HARDCORE_TYPE:
                return new TamagHardcoreController(tamagView, new TamagModel(100), main);
            default:
                new Error('Unsupported type')
        }
    }
}


class NewGameState {
    constructor(main) {
        this.main = main;
        this.elem = main.getRootElem();
    };

    render() {
        this.elem.innerHTML = null;
        let select = document.createElement('select');

        TamagFactory.TAMAG_TYPES.forEach((tamapType) => {
            let option = document.createElement('option');
            option.setAttribute('value', tamapType);
            option.innerHTML = tamapType;
            select.appendChild(option);
        });

        let button = document.createElement('button');
        button.innerHTML = 'Start';
        button.addEventListener('click', (event) => { this._handleStart(select) });

        this.elem.appendChild(select);
        this.elem.appendChild(button);
    }

    _handleStart(select) {
        let selectedGameType = select.value;

        if (TamagFactory.TAMAG_TYPES.includes(selectedGameType)) {
            this._startNewGame(selectedGameType);
        } else {
            alert("select type");
        }
    };

    _startNewGame(selectedGameType) {
        this.main.changeState(new GameInProgressState(this.main, selectedGameType))
    };
}

class GameOverState {
    constructor(main) {
        this.main = main;
        this.elem = main.getRootElem();
    };

    render() {
        let gameOver = document.createElement('p');
        gameOver.innerHTML = 'YOU DIED';

        let button = document.createElement('button');
        button.innerHTML = 'Start';
        button.addEventListener('click', (event) => { this._startNewGame() });

        this.elem.appendChild(gameOver);
        this.elem.appendChild(button);
    }

    _startNewGame() {
        this.main.changeState(new NewGameState(this.main));
    };
}

class GameInProgressState {
    constructor(main, type) {
        this.game = TamagFactory.getGameByType(type, main);
    };

    render(){
        this.game.render();
    }
}


class Main {

    static run(elem) {
        new Main(elem).render();
    }

    constructor(elem) {
        this.elem = elem;
        this.state = new NewGameState(this);
    }

    changeState(state) {
        this.state = state;
        this.elem.innerHTML = null;
        this.render();
    }

    getRootElem() {
        return this.elem;
    }

    render() {
        this.state.render();
    }
}

Main.run(document.getElementById('game1'));
// Main.run(document.getElementById('game2'));
// Main.run(document.getElementById('game3'));
