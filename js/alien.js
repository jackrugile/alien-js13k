/*==============================================================================
Init
==============================================================================*/
function Alien( game ) {
	this.x = -500;
	this.y = -game.moon.radius - 1500;
	this.vx = 0;
	this.vy = 0;
	this.radius = 40;
	this.drawRadius = this.radius;
	this.landOffset = 30;
	this.rotation = 0;
	this.dist = null;
	this.fillStyle = '#e82';
	var dx = this.x - game.moon.x;
	var dy = this.y - game.moon.y;
	this.dist = distance( this.x, this.y, game.moon.x, game.moon.y );
	this.distFromGround = Math.max( 0, this.dist - game.moon.radius - this.radius + this.landOffset );
	this.oDistFromGround = this.distFromGround;
	this.angle = Math.atan2( dy, dx );
}

/*==============================================================================
Jump
==============================================================================*/
Alien.prototype.jump = function() {
	sounds.push( new Sound({
		oscType: 2,
		freqStart: 500,
		freqEnd: 600,
		freqChange: 10
	}));
	this.vx += Math.cos( this.angle ) * 8;
	this.vy += Math.sin( this.angle ) * 8;
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
	this.oDistFromGround = this.distFromGround;	
	this.distFromGround = Math.max( 0, this.dist - game.moon.radius - this.radius + this.landOffset );

	if( this.distFromGround <= 0 ) {
		this.x = Math.cos( this.angle ) * ( game.moon.radius + this.radius - this.landOffset );
		this.y = Math.sin( this.angle ) * ( game.moon.radius + this.radius - this.landOffset );
		this.vx = ( -this.vx * 0.3 );
		this.vy = ( -this.vy * 0.3 );
		if( this.oDistFromGround != 0 ) {
			sounds.push( new Sound({
				oscType: 1,
				freqStart: 61,
				freqEnd: 60,
				freqChange: 0.4
			}));
		}
	}

	if( this.distFromGround > game.moon.atmosphere ) {
		if( this.vy < 0 ) {
			this.vx = this.vx * 0.7;
			this.vy = this.vy * 0.7;
		}
	}
};

/*==============================================================================
Render
==============================================================================*/
Alien.prototype.render = function( game ) {
	//this.drawRadius = this.radius + Math.cos(game.tick / 10) * 1;

	/*==============================================================================
	Shadow
	==============================================================================*/
	var radiusShadow = this.drawRadius + this.distFromGround  / 40; 
		xShadow = Math.cos( this.angle ) * ( game.moon.radius - this.landOffset ),
		yShadow = Math.sin( this.angle ) * ( game.moon.radius - this.landOffset );		
	game.ctxmg.save();
	game.ctxmg.translate( xShadow, yShadow );
	game.ctxmg.rotate( this.angle - Math.PI / 2 );
	game.ctxmg.scale( 1, 1 - ( ( game.moon.radius - this.landOffset ) / game.moon.radius ) * 0.9 );	
	fillCircle( game.ctxmg, 0, 0, radiusShadow, 'hsla(0, 0%, 0%, ' + ( 0.45 - this.distFromGround  / 1000 ) + ')' );
	game.ctxmg.restore();

	/*==============================================================================
	Rotation and Translation
	==============================================================================*/
	game.ctxmg.save();
	game.ctxmg.translate( this.x, this.y );
	/*if( this.distFromGround > 0){
		this.rotation += 0.12;
	} else {
		if( this.distFromGround == this.oDistFromGround ) {
			if( this.rotation < Math.PI ) {
				this.rotation -= this.rotation / 20;
			} else {
				this.rotation += ( ( Math.PI * 2 ) - this.rotation ) / 20;
			}
		}
	}

	if( this.rotation >= Math.PI * 2 ){
		this.rotation = 0;
	}
	game.ctxmg.rotate( this.rotation );*/

	/*==============================================================================
	Left Foot
	==============================================================================*/
	var	radiusLeftFoot = this.drawRadius * 0.45;
		angleLeftFoot = ( Math.PI * 0.5 ) + Math.cos( game.tick / 5 ) * 0.2;
		xLeftFoot = 0 + Math.cos( angleLeftFoot ) * ( this.drawRadius ),
		yLeftFoot = 0 + Math.sin( angleLeftFoot ) * ( this.drawRadius );		
	game.ctxmg.save();
	game.ctxmg.beginPath();
	game.ctxmg.translate( xLeftFoot, yLeftFoot );
	game.ctxmg.rotate( -0.15 );
	game.ctxmg.scale( 1, 0.25 );	
	fillCircle( game.ctxmg, 0, 0, radiusLeftFoot, this.fillStyle );
	strokeCircle( game.ctxmg, 0, 0, radiusLeftFoot + 2, '#fff', 4 );
	game.ctxmg.restore();
	
	/*==============================================================================
	Body
	==============================================================================*/
	fillCircle( game.ctxmg, 0, 0, this.drawRadius, this.fillStyle );
	strokeCircle( game.ctxmg, 0, 0, this.drawRadius + 1, '#fff', 2 );

	/*==============================================================================
	Eyeball
	==============================================================================*/
	//var posOffset = Math.min( Math.PI / 4, ( this.dist - game.moon.radius - this.radius + this.landOffset ) / 250 );
	var	radiusEyeball = this.drawRadius * 0.5; 
		xEyeball = 0 + Math.cos( -0.6 ) * ( this.drawRadius - radiusEyeball * 0.75 ),
		yEyeball = 0 + Math.sin( -0.6 ) * ( this.drawRadius - radiusEyeball * 0.75 );		
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
	var	radiusMouth = this.drawRadius * 0.35; 
		xMouth = 0 + Math.cos( 0.4 + ( posOffset * 0.3 ) ) * ( this.drawRadius ),
		yMouth = 0 + Math.sin( 0.4 + ( posOffset * 0.3 ) ) * ( this.drawRadius );		
	game.ctxmg.save();
	game.ctxmg.beginPath();
	game.ctxmg.arc( 0, 0, this.drawRadius, 0, Math.PI * 2 );
	game.ctxmg.clip();
	game.ctxmg.translate( xMouth, yMouth );
	game.ctxmg.rotate( -0.1 );
	game.ctxmg.scale( 1 + posOffset, 0.25 + posOffset );	
	fillCircle( game.ctxmg, 0, 0, radiusMouth, '#b51' );
	game.ctxmg.restore();

	/*==============================================================================
	Spots
	==============================================================================*/
	var	radiusSpot1 = this.drawRadius * 0.12; 
		xSpot1 = 0 + Math.cos( -Math.PI * 0.75 ) * ( this.drawRadius * 0.7 ),
		ySpot1 = 0 + Math.sin( -Math.PI * 0.75 ) * ( this.drawRadius * 0.7 );		
	game.ctxmg.save();
	game.ctxmg.translate( xSpot1, ySpot1 );
	game.ctxmg.rotate( -Math.PI / 4 );
	game.ctxmg.scale( 1, 0.5 );	
	fillCircle( game.ctxmg, 0, 0, radiusSpot1, '#fb5' );
	game.ctxmg.restore();

	var	radiusSpot2 = this.drawRadius * 0.2; 
		xSpot2 = 0 + Math.cos( -Math.PI * 0.75 ) * ( this.drawRadius * 0.47 ),
		ySpot2 = 0 + Math.sin( -Math.PI * 0.75 ) * ( this.drawRadius * 0.47 );		
	game.ctxmg.save();
	game.ctxmg.translate( xSpot2, ySpot2 );
	game.ctxmg.rotate( -Math.PI / 4 );
	game.ctxmg.scale( 1, 0.5 );	
	fillCircle( game.ctxmg, 0, 0, radiusSpot2, '#fb5' );
	game.ctxmg.restore();

	/*==============================================================================
	Right Foot
	==============================================================================*/
	var	radiusRightFoot = this.drawRadius * 0.45;
		angleRightFoot = ( Math.PI * 0.5 ) + Math.cos( game.tick / 5 ) * -0.2;
		xRightFoot = 0 + Math.cos( angleRightFoot ) * ( this.drawRadius ),
		yRightFoot = 0 + Math.sin( angleRightFoot ) * ( this.drawRadius );		
	game.ctxmg.save();
	game.ctxmg.beginPath();
	game.ctxmg.translate( xRightFoot, yRightFoot );
	game.ctxmg.rotate( -0.15 );
	game.ctxmg.scale( 1, 0.25 );	
	fillCircle( game.ctxmg, 0, 0, radiusRightFoot, this.fillStyle );
	strokeCircle( game.ctxmg, 0, 0, radiusRightFoot + 2, '#fff', 4 );
	game.ctxmg.restore();

	/*==============================================================================
	Force Field
	==============================================================================*/
	//fillCircle( game.ctxmg, this.x, this.y, this.radius * 2, 'hsla(190, 100%, 50%, 0.2)' );
	//strokeCircle( game.ctxmg, this.x, this.y, this.radius * 2 + 2, 'hsla(190, 100%, 90%, 0.5)', 4 );

	game.ctxmg.restore();
};