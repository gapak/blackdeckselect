import React, { Component } from 'react';

const bonuses = {
  1: ['11', '12', '13'],
  2: ['21', '22', '23'],
  3: ['31', '32', '33'],
};

const marks = [
  '0',
  'Абсолютный бездарь',
  'Отдаленное понимание',
  'Любительское понимание',
  'Молодой специалист',
  'Специалист',
  'Опытный специалист',
  'Уверенный профессионал',
  'Исключительный профессионал',
  'Признанный гуру'
];

class App extends Component {

  constructor(props) {
    super(props);

    this.state = {
      high_bonus: 1,
      //mid_bonus: 0.9410360288810285, // 15
      mid_bonus: 0.8972021020145473, // 13
      low_bonus: 0.7937005259841, // 9
      //mid_bonus: 0.873580464736298857, // 12
      //low_bonus: 0.693361274350634716, // 6

      name: 'Name Secondname',

      expr: 'specialist',
      speed: 'normal',
      team: 'teamplayer',

      design: 1,
      engineering: 1,
      creative: 1,

      bonus: 0,
    };


    this.exprOptionChange = this.exprOptionChange.bind(this);
    this.speedOptionChange = this.speedOptionChange.bind(this);
    this.teamOptionChange = this.teamOptionChange.bind(this);

    this.calcSkillsSum = this.calcSkillsSum.bind(this);

    this.raise_skill = this.raise_skill.bind(this);
    this.lower_skill = this.lower_skill.bind(this);
  }

  exprOptionChange(changeEvent) {
    this.setState({
      expr: changeEvent.target.value
    });
  }

  speedOptionChange(changeEvent) {
    this.setState({
      speed: changeEvent.target.value
    });
  }

  teamOptionChange(changeEvent) {
    this.setState({
      team: changeEvent.target.value
    });
  }

  calcSkillsSum() {
    var base = 18;

    switch (this.state.expr) {
      case 'junior':
        base *= this.state.low_bonus;
        break;
      case 'specialist':
        base *= this.state.mid_bonus;
        break;
      case 'expert':
        base *= this.state.high_bonus;
        break;
      default:
        console.log('error case: ' + this.state.expr);
    }

    switch (this.state.speed) {
      case 'slow':
        base *= this.state.high_bonus;
        break;
      case 'normal':
        base *= this.state.mid_bonus;
        break;
      case 'fast':
        base *= this.state.low_bonus;
        break;
      default:
        console.log('error case: ' + this.state.speed);
    }

    switch (this.state.team) {
      case 'alone':
        base *= this.state.high_bonus;
        break;
      case 'teamplayer':
        base *= this.state.mid_bonus;
        break;
      case 'leader':
        base *= this.state.low_bonus;
        break;
      default:
        console.log('error case: ' + this.state.team);
    }


    return base;
  }

  raise_skill(skill) {
    if (this.state[skill] < 9 && this.stats_sum() + 1 < this.calcSkillsSum() ) {
      let o = {};
      o[skill] = this.state[skill] + 1;
      this.setState(o)
    }
  }

  lower_skill(skill) {
    if (this.state[skill] > 1) {
      let o = {};
      o[skill] = this.state[skill] - 1;
      this.setState(o)
    }
  }

  stats_sum() {
    return this.state.design + this.state.engineering + this.state.creative;
  }


  render() {
    const make_text = (name, key) =>
        <div className="text">
          {name}: <input type="text" name="key" className="form-inline"
                            value={this.state[key]}
                            onChange={(event) => {
                              let o = {};
                              o[key] = event.target.value;
                              this.setState(o)
                            }}
        />
        </div>

    const make_radio = (type, key, callback, text) =>
      <div className="radio">
        <label>
          <input type="radio" value={key}
                 checked={(() => { return this.state[type] === key; })()}
                 onChange={callback} />
          {text}
        </label>
      </div>


    return (
      <div className="App">
        <h1 className="App-title">Build your Hero</h1>

        <form>

          {make_text("Your name", "name")}

          <div name = 'setup'>
          <h3 className="App-title">Setup const</h3>
          {make_text("Mid_bonus", "mid_bonus")}
          {make_text("Low_bonus", "low_bonus")}
          </div>


          <h3 className="App-title">Choose perks</h3>
          <div name = 'expr'>
            Choose your experience:
            {make_radio("expr", "junior", this.exprOptionChange, "Junior - you can work only with small projects")}
            {make_radio("expr", "specialist", this.exprOptionChange, "Specialist - you can work with small amd medium projects")}
            {make_radio("expr", "expert", this.exprOptionChange, "Expert - you can work with projects of any size")}
          </div>

          <div name = 'speed'>
            Choose your workspeed:
            {make_radio("speed", "slow", this.speedOptionChange, "Slow - your workspeed halved")}
            {make_radio("speed", "normal", this.speedOptionChange, "Normal workspeed")}
            {make_radio("speed", "fast", this.speedOptionChange, "Fast - your wokrspeed is 1.5 faster")}
          </div>

          <div name = 'team'>
            Choose your communication skills:
            {make_radio("team", "alone", this.teamOptionChange, "You can work only alone")}
            {make_radio("team", "teamplayer", this.teamOptionChange, "You can work with a partner")}
            {make_radio("team", "leader", this.teamOptionChange, "You can work in team")}
          </div>

        </form>



        <h3 className="App-title">Form Skills</h3>
        <div>
          Summ of your skills should be: {Math.floor(this.calcSkillsSum())} ({this.calcSkillsSum()})
        </div>
        <div>
          <div name = 'design'>
            Design
            <button onClick={() => {this.lower_skill('design')}}> {'<'} </button>
            <span> {this.state.design} </span>
            <button onClick={() => {this.raise_skill('design')}}> {'>'} </button>
            {marks[this.state.design]}
          </div>
          <div name = 'engineering'>
            Engineering
            <button onClick={() => {this.lower_skill('engineering')}}> {'<'} </button>
            <span> {this.state.engineering} </span>
            <button onClick={() => {this.raise_skill('engineering')}}> {'>'} </button>
            {marks[this.state.engineering]}
          </div>
          <div name = 'creative'>
            Creative
            <button onClick={() => {this.lower_skill('creative')}}> {'<'} </button>
            <span> {this.state.creative} </span>
            <button onClick={() => {this.raise_skill('creative')}}> {'>'} </button>
            {marks[this.state.creative]}
          </div>
        </div>

      </div>
    );
  }
}

export default App;
