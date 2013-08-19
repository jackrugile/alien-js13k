/*==============================================================================
Init
==============================================================================*/
function Spike( $ ) {
	this.radius = rand( 5, 50 );
	this.angle = -0.75;
	this.altitude = rand( 0, $.moon.atmosphere - this.radius);
	this.speed = 0.002;
	this.x = Math.cos( this.angle ) * ( $.moon.radius - $.landOffset + this.radius + this.altitude );
	this.y = Math.sin( this.angle ) * ( $.moon.radius - $.landOffset + this.radius + this.altitude );
}

/*==============================================================================
Update
==============================================================================*/
Spike.prototype.update = function( $, i ) {
	this.angle -= this.speed;
	//this.altitude = this.altitude + Math.cos( $.tick / 10 ) * 10;
	this.x = Math.cos( this.angle ) * ( $.moon.radius - $.landOffset + this.radius + this.altitude );
	this.y = Math.sin( this.angle ) * ( $.moon.radius - $.landOffset + this.radius + this.altitude );
};

/*==============================================================================
Render
==============================================================================*/
Spike.prototype.render = function( $, i ) {
	$.ctxmg.save();
	$.ctxmg.translate( this.x, this.y );
	fillCircle( $.ctxmg, 0, 0, this.radius, '#900' );
	strokeCircle( $.ctxmg, 0, 0, this.radius + 1, '#fff', 2 );
	$.ctxmg.restore();
};