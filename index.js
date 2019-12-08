class Randomaizer {
  static getRandom(min, max) {
    return Math.round(min + Math.random() * (max - min));
  }
}

class TamagDtoStats {
  constructor(statValue, statName) {
    this.statValue = statValue;
    this.name = statName;
  }
}

class TamagDtoButton {
  constructor(name, button) {
    this.name = name;
    this.btn = button;
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

  static get EAT_FUNC_NAME() { return 'eat' };
  static get HAPPY_FUNC_NAME() { return 'run' };
  static get CLEAN_FUNC_NAME() { return 'wash' };

  static get DOCTOR_FUNC_NAME() { return 'doctor' };
  static get BUY_FOOD_FUNC_NAME() { return 'buy food' };
  static get START_BUSINESS_FUNC_NAME() { return 'start a business' };

  static get GO_TO_WORK_FUNC_NAME() { return 'go to work' };
  static get GO_TO_BAR_FUNC_NAME() { return 'go to bar' };

  constructor(maxStat = TamagModel.DEFAULT_MAX_STAT) {
    this.maxStat = maxStat;

    this.eatStat = Randomaizer.getRandom(TamagModel.DEFAULT_MIN_STAT, maxStat);
    this.cleanStat = Randomaizer.getRandom(TamagModel.DEFAULT_MIN_STAT, maxStat);
    this.happyStat = Randomaizer.getRandom(TamagModel.DEFAULT_MIN_STAT, maxStat);
    this.healthStat = Randomaizer.getRandom(TamagModel.DEFAULT_MIN_STAT, maxStat);
    this.socializationStat = Randomaizer.getRandom(TamagModel.DEFAULT_MIN_STAT, maxStat);
    this.moneyStat = Randomaizer.getRandom(TamagModel.DEFAULT_MIN_STAT, maxStat);
  }

  executeAction(action) {
    switch (action) {
      case TamagModel.EAT_FUNC_NAME:
        return this._eat();
      
      case TamagModel.HAPPY_FUNC_NAME:
        return this._happy();
      
      case TamagModel.CLEAN_FUNC_NAME:
        return this._clean();
      
      case TamagModel.DOCTOR_FUNC_NAME:
        return this._doctor();
      
      case TamagModel.BUY_FOOD_FUNC_NAME:
        return this._buyFood();
    
      case TamagModel.START_BUSINESS_FUNC_NAME:
        return this._startBusiness();      
    
      case TamagModel.GO_TO_WORK_FUNC_NAME:
        return this._goTOWork();

      case TamagModel.GO_TO_BAR_FUNC_NAME:
        return this._goToBar();

      default:
        new Error('Unsupported tamag action name')
    }
  }

  getStats() {
    return [
      new TamagDtoStats(this.eatStat, 'Eat'),
      new TamagDtoStats(this.happyStat, 'Happy'),
      new TamagDtoStats(this.cleanStat, 'Clean'),

      new TamagDtoStats(this.healthStat, 'Health'),
      new TamagDtoStats(this.socializationStat, 'Socialization'),
      new TamagDtoStats(this.moneyStat, 'Money')
    ]
  }

  getBtns() {
    return [
      new TamagDtoButton('eat', TamagModel.EAT_FUNC_NAME),
      new TamagDtoButton('run', TamagModel.HAPPY_FUNC_NAME),
      new TamagDtoButton('wash', TamagModel.CLEAN_FUNC_NAME),
      new TamagDtoButton('visit a doctor', TamagModel.DOCTOR_FUNC_NAME),
      new TamagDtoButton('buy food', TamagModel.BUY_FOOD_FUNC_NAME),
      new TamagDtoButton('start a business', TamagModel.START_BUSINESS_FUNC_NAME),
      new TamagDtoButton('go to the bar', TamagModel.GO_TO_BAR_FUNC_NAME),
      new TamagDtoButton('go to work', TamagModel.GO_TO_WORK_FUNC_NAME)
    ]

  }

  isTamagDead() {
    return !!this.getStats().find((statDto) => statDto.statValue < 0)
  }

  decreaseStatsBy(num) {
    this.eatStat -= num;
    this.happyStat -= num;
    this.cleanStat -= num;
    this.healthStat -= num;
    this.socializationStat -= num;
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

  _doctor() {
    this.healthStat = this._assignStat(this.healthStat, 30);
    this.moneyStat -= 20;
  }

  _buyFood() {
    this.eatStat = this._assignStat(this.eatStat, 20);
    this.moneyStat -= 20;
  }

  _goToBar() {
    this.socializationStat = this._assignStat(this.socializationStat, 40);
    this.eatStat = this._assignStat(this.eatStat, 10);
    this.moneyStat -= 20;
    this.healthStat -= 10;
  }

  _goTOWork() {
    this.moneyStat +=  50;
    this.eatStat -= 10;
    this.healthStat -= 10;
    this.socializationStat -= 20;
  }

  _startBusiness() {
    this.moneyStat += 100
    this.happyStat = this._assignStat(this.happyStat, 100);
    this.healthStat -= 100;
    this.socializationStat = this._assignStat(this.socializationStat, 20);
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
  renderGame(statsDtos, timerDto, btnsDtos) {
    this.elem.innerHTML = null;

    statsDtos.forEach((statProps) => {
      let container = document.createElement('div');
      container.style.display = 'flex';
      container.style.justifyContent ="center";

      let statName = document.createElement('p');
      statName.innerHTML = statProps.name;

      let statValueElem = document.createElement('p');
      statValueElem.innerHTML = '    . . . .  ' + statProps.statValue + ' . . . ';
      
      container.appendChild(statName);
      container.appendChild(statValueElem);
      this.elem.appendChild(container)
    });

    let container = document.createElement('div');    
    container.style.display = 'flex';
    container.style.margin = '0 auto'
    container.style.justifyContent = 'space-around';
    container.style.width = '700px';

    btnsDtos.forEach((btn) => {
      let actionButton = document.createElement('button');
      actionButton.innerHTML = btn.name;
      
      container.appendChild(actionButton);
      this.elem.appendChild(container)
      actionButton.addEventListener('click', () => {
        this.action(btn.btn);
      });
    });

    let timer = document.createElement('p');
    timer.innerHTML = timerDto.minutes + ' : ' + timerDto.seconds;
    timer.style.textAlign = 'center';
    this.elem.appendChild(timer)
  }
}

class TamgControllerAbstract {
  constructor(temagView, tamagModel, main, seconds) {
    this.temagView = temagView;
    this.tamagModel = tamagModel;

    this.main = main;

    this.temagView.setActionHandler(this.executeAction.bind(this));

    this.startTime = new Date();

    this._initTimer();
    this._initStatsDecreasing(seconds);
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

  _initStatsDecreasing(seconds) {
    this.decreaseStatsId = setInterval(() => {
      this._decreaseStats();

      this._renderGame();
    }, seconds * 1000)
  };

  _renderGame() {
    if (this.tamagModel.isTamagDead()) return this._gameOver();
    this.temagView.renderGame(this._getTamagStats(), new TimerDto(this.startTime), this._getTamagBtns());
  }

  _getTamagStats() {
    return this.tamagModel.getStats();
  }

  _getTamagBtns() {
    return this.tamagModel.getBtns();
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
    this.tamagModel.decreaseStatsBy(3);
  }
}

class TamagHardcoreController extends TamgControllerAbstract {
  _decreaseStats() {
    this.tamagModel.decreaseStatsBy(5);
  }
}

class TamagNinjaController extends TamgControllerAbstract {
  _decreaseStats() {
    this.tamagModel.decreaseStatsBy(7);
  }
}

class TamagFactory {
  static get LAZY_TYPE() { return 'lazy' };
  static get HARDCORE_TYPE() { return 'hardcore' };
  static get NINJA_TYPE() { return 'ninja' };

  static get TAMAG_TYPES() { return [TamagFactory.LAZY_TYPE, TamagFactory.HARDCORE_TYPE, TamagFactory.NINJA_TYPE] }

  static getGameByType(type, main) {
    let tamagView = new TamagView(main.getRootElem());

    switch (type) {
      case TamagFactory.LAZY_TYPE:
        return new TamagLazyController(tamagView, new TamagModel(100), main, 5);
      
      case TamagFactory.HARDCORE_TYPE:
        return new TamagHardcoreController(tamagView, new TamagModel(), main, 5);
      
      case TamagFactory.NINJA_TYPE:
        return new TamagNinjaController(tamagView, new TamagModel(), main, 7);
      
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
    gameOver.style.margin = '0 auto';

    let button = document.createElement('button');
    button.innerHTML = 'Start';
    button.style.margin = '0 auto';
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

  render() {
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

Main.run(document.getElementById('game2'));
Main.run(document.getElementById('game3'));
