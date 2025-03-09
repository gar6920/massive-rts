const { Schema, MapSchema, ArraySchema, type } = require('@colyseus/schema');

class Position extends Schema {
  constructor(x = 0, y = 0) {
    super();
    this.x = x;
    this.y = y;
  }

  @type("number") x = 0;
  @type("number") y = 0;
}

class Ability extends Schema {
  constructor(name = "", cooldown = 0) {
    super();
    this.name = name;
    this.cooldown = cooldown;
    this.currentCooldown = 0;
  }

  @type("string") name = "";
  @type("number") cooldown = 0;
  @type("number") currentCooldown = 0;
}

class Hero extends Schema {
  constructor(id = "", owner = "", x = 0, y = 0, health = 100) {
    super();
    this.id = id;
    this.owner = owner;
    this.position = new Position(x, y);
    this.health = health;
    this.abilities = new ArraySchema();
  }

  @type("string") id = "";
  @type("string") owner = "";
  @type(Position) position = new Position();
  @type("number") health = 100;
  @type([Ability]) abilities = new ArraySchema();
}

class Building extends Schema {
  constructor(id = "", type = "", owner = "", x = 0, y = 0, health = 200) {
    super();
    this.id = id;
    this.type = type;
    this.owner = owner;
    this.position = new Position(x, y);
    this.health = health;
    this.isComplete = false;
    this.buildProgress = 0;
  }

  @type("string") id = "";
  @type("string") type = "";
  @type("string") owner = "";
  @type(Position) position = new Position();
  @type("number") health = 200;
  @type("boolean") isComplete = false;
  @type("number") buildProgress = 0;
}

class Unit extends Schema {
  constructor(id = "", type = "", owner = "", x = 0, y = 0, health = 50) {
    super();
    this.id = id;
    this.type = type;
    this.owner = owner;
    this.position = new Position(x, y);
    this.health = health;
    this.targetId = null;
  }

  @type("string") id = "";
  @type("string") type = "";
  @type("string") owner = "";
  @type(Position) position = new Position();
  @type("number") health = 50;
  @type("string") targetId = null;
}

class Resources extends Schema {
  constructor(wood = 100, stone = 50, food = 200) {
    super();
    this.wood = wood;
    this.stone = stone;
    this.food = food;
  }

  @type("number") wood = 100;
  @type("number") stone = 50;
  @type("number") food = 200;
}

class PlayerData extends Schema {
  constructor() {
    super();
    this.hero = new Hero();
    this.resources = new Resources();
    this.isConnected = true;
  }

  @type(Hero) hero = new Hero();
  @type(Resources) resources = new Resources();
  @type("boolean") isConnected = true;
}

class GameState extends Schema {
  constructor() {
    super();
    this.players = new MapSchema();
    this.buildings = new MapSchema();
    this.units = new MapSchema();
    this.humanBaseHealth = 1000;
    this.aiBaseHealth = 1000;
    this.gameTime = 0;
    this.map = new ArraySchema();
  }

  @type({ map: PlayerData }) players = new MapSchema();
  @type({ map: Building }) buildings = new MapSchema();
  @type({ map: Unit }) units = new MapSchema();
  @type("number") humanBaseHealth = 1000;
  @type("number") aiBaseHealth = 1000;
  @type("number") gameTime = 0; // in seconds
  @type(["number"]) map = new ArraySchema(); // tile data
}

module.exports = { 
  GameState, 
  PlayerData, 
  Hero, 
  Building, 
  Unit, 
  Position, 
  Ability, 
  Resources 
}; 