function Character(x, y, ID){
    this.x=x;
    this.y=y;
    this.ID=ID;

    decorate(this, new Interactable(), [x, y, 600]);
    decorate(this, new Talkable(), [ID]);
}



