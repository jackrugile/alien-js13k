/*==============================================================================
Init
==============================================================================*/
function Alien( game ) {
	this.x = -500;
	this.y = -game.moon.radius - 1500;
	this.vx = 0;
	this.vy = 0;
	this.radius = 40;
	this.landOffset = 30;
	this.dist = null;
	this.fillStyle = '#e82';
	var dx = this.x - game.moon.x;
	var dy = this.y - game.moon.y;
	this.dist = distance( this.x, this.y, game.moon.x, game.moon.y );
	this.distFromGround = Math.max( 0, this.dist - game.moon.radius - this.radius + this.landOffset );
	this.angle = Math.atan2( dy, dx );
}

/*==============================================================================
Update
==============================================================================*/
Alien.prototype.update = function( game ) {
	this.vx += ( Math.cos( this.angle ) * -game.gravity ) * game.dt;
	this.vy += ( Math.sin( this.angle ) * -game.gravity ) * game.dt;
	this.x += this.vx * game.dt;
	this.y += this.vy * game.dt;
	this.dist = distance( this.x, this.y, game.moon.x, game.moon.y );
	this.distFromGround = Math.max( 0, this.dist - game.moon.radius - this.radius + this.landOffset );
	
	//if( this.dist - this.radius < game.moon.radius - this.landOffset ) {
	if( this.distFromGround <= 0 ) {
		this.x = Math.cos( this.angle ) * ( game.moon.radius + this.radius - this.landOffset );
		this.y = Math.sin( this.angle ) * ( game.moon.radius + this.radius - this.landOffset );
		this.vx = ( -this.vx * 0.3 );
		this.vy = ( -this.vy * 0.3 );
	}

	if(this.distFromGround > game.moon.atmosphere ) {
		if( this.vy < 0 ) {
			this.vx = 0;
			this.vy = this.vy * 0.7;
		}
	}
};

/*==============================================================================
Render
==============================================================================*/
Alien.prototype.render = function( game ) {
	/*==============================================================================
	Shadow
	==============================================================================*/
	var radiusShadow = this.radius + this.distFromGround  / 40; 
		xShadow = Math.cos( this.angle ) * ( game.moon.radius - this.landOffset ),
		yShadow = Math.sin( this.angle ) * ( game.moon.radius - this.landOffset );		
	game.ctxmg.save();
	game.ctxmg.translate( xShadow, yShadow );
	game.ctxmg.rotate( this.angle - Math.PI / 2 );
	game.ctxmg.scale( 1, 1 - ( ( game.moon.radius - this.landOffset ) / game.moon.radius ) * 0.9 );	
	fillCircle( game.ctxmg, 0, 0, radiusShadow, 'hsla(0, 0%, 0%, ' + ( 0.45 - this.distFromGround  / 1000 ) + ')' );
	game.ctxmg.restore();
	
	/*==============================================================================
	Body
	==============================================================================*/
	fillCircle( game.ctxmg, this.x, this.y, this.radius, this.fillStyle );
	strokeCircle( game.ctxmg, this.x, this.y, this.radius + 1, '#fff', 2 );

	/*==============================================================================
	Eyeball
	==============================================================================*/
	//var posOffset = Math.min( Math.PI / 4, ( this.dist - game.moon.radius - this.radius + this.landOffset ) / 250 );
	var	radiusEyeball = this.radius * 0.5; 
		xEyeball = this.x + Math.cos( -0.6 ) * ( this.radius - radiusEyeball * 0.75 ),
		yEyeball = this.y + Math.sin( -0.6 ) * ( this.radius - radiusEyeball * 0.75 );		
	fillCircle( game.ctxmg, xEyeball, yEyeball, radiusEyeball, '#fff' );

	/*==============================================================================
	Pupil
	==============================================================================*/
	var posOffset = Math.min( Math.PI / 4, this.distFromGround / 250 );
	var	radiusPupil = radiusEyeball * 0.5; 
		xPupil = xEyeball + Math.cos( posOffset ) * ( radiusEyeball - radiusPupil * 1.2 ),
		yPupil = yEyeball + Math.sin( posOffset ) * ( radiusEyeball - radiusPupil * 1.2 );		
	fillCircle( game.ctxmg, xPupil, yPupil, radiusPupil, '#222' );

	/*==============================================================================
	Pupil Highlight
	==============================================================================*/
	var	radiusPupilHighlight = radiusPupil * 0.2; 
		xPupilHighlight = xPupil + Math.cos( -1.8 ) * ( radiusPupil - radiusPupilHighlight * 2 ),
		yPupilHighlight = yPupil + Math.sin( -1.8 ) * ( radiusPupil - radiusPupilHighlight * 2 );		
	fillCircle( game.ctxmg, xPupilHighlight, yPupilHighlight, radiusPupilHighlight, '#fff' );

	/*==============================================================================
	Mouth
	==============================================================================*/
	posOffset = Math.min( 0.25, this.distFromGround / 250 );
	var	radiusMouth = this.radius * 0.35; 
		xMouth = this.x + Math.cos( 0.4 + ( posOffset * 0.3 ) ) * ( this.radius ),
		yMouth = this.y + Math.sin( 0.4 + ( posOffset * 0.3 ) ) * ( this.radius );		
	game.ctxmg.save();
	game.ctxmg.beginPath();
	game.ctxmg.arc( this.x, this.y, this.radius, 0, Math.PI * 2 );
	game.ctxmg.clip();
	game.ctxmg.translate( xMouth, yMouth );
	game.ctxmg.rotate( -0.1 );
	game.ctxmg.scale( 1 + posOffset, 0.25 + posOffset );	
	fillCircle( game.ctxmg, 0, 0, radiusMouth, '#b51' );
	game.ctxmg.restore();

	/*==============================================================================
	Spots
	==============================================================================*/
	var	radiusSpot1 = this.radius * 0.12; 
		xSpot1 = this.x + Math.cos( -Math.PI * 0.75 ) * ( this.radius * 0.7 ),
		ySpot1 = this.y + Math.sin( -Math.PI * 0.75 ) * ( this.radius * 0.7 );		
	game.ctxmg.save();
	game.ctxmg.translate( xSpot1, ySpot1 );
	game.ctxmg.rotate( -Math.PI / 4 );
	game.ctxmg.scale( 1, 0.5 );	
	fillCircle( game.ctxmg, 0, 0, radiusSpot1, '#fb5' );
	game.ctxmg.restore();

	var	radiusSpot2 = this.radius * 0.2; 
		xSpot2 = this.x + Math.cos( -Math.PI * 0.75 ) * ( this.radius * 0.47 ),
		ySpot2 = this.y + Math.sin( -Math.PI * 0.75 ) * ( this.radius * 0.47 );		
	game.ctxmg.save();
	game.ctxmg.translate( xSpot2, ySpot2 );
	game.ctxmg.rotate( -Math.PI / 4 );
	game.ctxmg.scale( 1, 0.5 );	
	fillCircle( game.ctxmg, 0, 0, radiusSpot2, '#fb5' );
	game.ctxmg.restore();

	/*==============================================================================
	Force Field
	==============================================================================*/
	//fillCircle( game.ctxmg, this.x, this.y, this.radius * 2, 'hsla(190, 100%, 50%, 0.2)' );
	//strokeCircle( game.ctxmg, this.x, this.y, this.radius * 2 + 2, 'hsla(190, 100%, 90%, 0.5)', 4 );
};