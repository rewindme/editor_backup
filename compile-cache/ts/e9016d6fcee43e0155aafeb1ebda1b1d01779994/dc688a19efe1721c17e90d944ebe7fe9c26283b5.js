var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var Animal = (function () {
    function Animal(name) {
        this.name = name;
    }
    Animal.prototype.move = function (meters) {
        alert(this.name + " moved " + meters + "m.");
    };
    return Animal;
})();
var Snake = (function (_super) {
    __extends(Snake, _super);
    function Snake(name) {
        _super.call(this, name);
    }
    Snake.prototype.move = function () {
        alert("Slithering...");
        _super.prototype.move.call(this, 5);
    };
    return Snake;
})(Animal);
var Horse = (function (_super) {
    __extends(Horse, _super);
    function Horse(name) {
        _super.call(this, name);
    }
    Horse.prototype.move = function () {
        alert("Galloping...");
        _super.prototype.move.call(this, 45);
    };
    return Horse;
})(Animal);
var sam = new Snake("Sammy the Python");
var tom = new Horse("Tommy the Palomino");
sam.move();
tom.move(34);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiL1VzZXJzL25hdmVyLy5hdG9tL3BhY2thZ2VzL3ByZXZpZXcvc3BlYy9zYW1wbGVzL3NpbXBsZV9pbmhlcml0YW5jZS50cyIsInNvdXJjZXMiOlsiL1VzZXJzL25hdmVyLy5hdG9tL3BhY2thZ2VzL3ByZXZpZXcvc3BlYy9zYW1wbGVzL3NpbXBsZV9pbmhlcml0YW5jZS50cyJdLCJuYW1lcyI6WyJBbmltYWwiLCJBbmltYWwuY29uc3RydWN0b3IiLCJBbmltYWwubW92ZSIsIlNuYWtlIiwiU25ha2UuY29uc3RydWN0b3IiLCJTbmFrZS5tb3ZlIiwiSG9yc2UiLCJIb3JzZS5jb25zdHJ1Y3RvciIsIkhvcnNlLm1vdmUiXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBLElBQU0sTUFBTTtJQUNSQSxTQURFQSxNQUFNQSxDQUNXQSxJQUFZQTtRQUFaQyxTQUFJQSxHQUFKQSxJQUFJQSxDQUFRQTtJQUFJQSxDQUFDQTtJQUNwQ0QscUJBQUlBLEdBQUpBLFVBQUtBLE1BQWNBO1FBQ2ZFLEtBQUtBLENBQUNBLElBQUlBLENBQUNBLElBQUlBLEdBQUdBLFNBQVNBLEdBQUdBLE1BQU1BLEdBQUdBLElBQUlBLENBQUNBLENBQUNBO0lBQ2pEQSxDQUFDQTtJQUNMRixhQUFDQTtBQUFEQSxDQUFDQSxBQUxELElBS0M7QUFFRCxJQUFNLEtBQUs7SUFBU0csVUFBZEEsS0FBS0EsVUFBZUE7SUFDdEJBLFNBREVBLEtBQUtBLENBQ0tBLElBQVlBO1FBQUlDLGtCQUFNQSxJQUFJQSxDQUFDQSxDQUFDQTtJQUFDQSxDQUFDQTtJQUMxQ0Qsb0JBQUlBLEdBQUpBO1FBQ0lFLEtBQUtBLENBQUNBLGVBQWVBLENBQUNBLENBQUNBO1FBQ3ZCQSxnQkFBS0EsQ0FBQ0EsSUFBSUEsWUFBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7SUFDbEJBLENBQUNBO0lBQ0xGLFlBQUNBO0FBQURBLENBQUNBLEFBTkQsRUFBb0IsTUFBTSxFQU16QjtBQUVELElBQU0sS0FBSztJQUFTRyxVQUFkQSxLQUFLQSxVQUFlQTtJQUN0QkEsU0FERUEsS0FBS0EsQ0FDS0EsSUFBWUE7UUFBSUMsa0JBQU1BLElBQUlBLENBQUNBLENBQUNBO0lBQUNBLENBQUNBO0lBQzFDRCxvQkFBSUEsR0FBSkE7UUFDSUUsS0FBS0EsQ0FBQ0EsY0FBY0EsQ0FBQ0EsQ0FBQ0E7UUFDdEJBLGdCQUFLQSxDQUFDQSxJQUFJQSxZQUFDQSxFQUFFQSxDQUFDQSxDQUFDQTtJQUNuQkEsQ0FBQ0E7SUFDTEYsWUFBQ0E7QUFBREEsQ0FBQ0EsQUFORCxFQUFvQixNQUFNLEVBTXpCO0FBRUQsSUFBSSxHQUFHLEdBQUcsSUFBSSxLQUFLLENBQUMsa0JBQWtCLENBQUMsQ0FBQztBQUN4QyxJQUFJLEdBQUcsR0FBVyxJQUFJLEtBQUssQ0FBQyxvQkFBb0IsQ0FBQyxDQUFDO0FBRWxELEdBQUcsQ0FBQyxJQUFJLEVBQUUsQ0FBQztBQUNYLEdBQUcsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJjbGFzcyBBbmltYWwge1xuICAgIGNvbnN0cnVjdG9yKHB1YmxpYyBuYW1lOiBzdHJpbmcpIHsgfVxuICAgIG1vdmUobWV0ZXJzOiBudW1iZXIpIHtcbiAgICAgICAgYWxlcnQodGhpcy5uYW1lICsgXCIgbW92ZWQgXCIgKyBtZXRlcnMgKyBcIm0uXCIpO1xuICAgIH1cbn1cblxuY2xhc3MgU25ha2UgZXh0ZW5kcyBBbmltYWwge1xuICAgIGNvbnN0cnVjdG9yKG5hbWU6IHN0cmluZykgeyBzdXBlcihuYW1lKTsgfVxuICAgIG1vdmUoKSB7XG4gICAgICAgIGFsZXJ0KFwiU2xpdGhlcmluZy4uLlwiKTtcbiAgICAgICAgc3VwZXIubW92ZSg1KTtcbiAgICB9XG59XG5cbmNsYXNzIEhvcnNlIGV4dGVuZHMgQW5pbWFsIHtcbiAgICBjb25zdHJ1Y3RvcihuYW1lOiBzdHJpbmcpIHsgc3VwZXIobmFtZSk7IH1cbiAgICBtb3ZlKCkge1xuICAgICAgICBhbGVydChcIkdhbGxvcGluZy4uLlwiKTtcbiAgICAgICAgc3VwZXIubW92ZSg0NSk7XG4gICAgfVxufVxuXG52YXIgc2FtID0gbmV3IFNuYWtlKFwiU2FtbXkgdGhlIFB5dGhvblwiKTtcbnZhciB0b206IEFuaW1hbCA9IG5ldyBIb3JzZShcIlRvbW15IHRoZSBQYWxvbWlub1wiKTtcblxuc2FtLm1vdmUoKTtcbnRvbS5tb3ZlKDM0KTtcbiJdfQ==