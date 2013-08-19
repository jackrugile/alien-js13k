/*==============================================================================
Init
==============================================================================*/
function Alien( $ ) {
	this.x = -500;
	this.y = -$.moon.radius - 1500;
	this.vx = 0;
	this.vy = 0;
	this.radius = 40;
	this.drawRadius = this.radius;
	this.rotation = 0;
	this.dist = null;
	this.fillStyle = '#e82';
	var dx = this.x - $.moon.x;
	var dy = this.y - $.moon.y;
	this.dist = distance( this.x, this.y, $.moon.x, $.moon.y );
	this.distFromGround = Math.max( 0, this.dist - $.moon.radius - this.radius + $.landOffset );
	this.oDistFromGround = this.distFromGround;
	this.angle = Math.atan2( dy, dx );
}

/*==============================================================================
Jump
==============================================================================*/
Alien.prototype.jump = function( $ ) {
	sounds.push( new Sound({
		oscType: 3,
		freqStart: 500,
		freqEnd: 600,
		freqChange: 10
	}));
	this.vx += Math.cos( this.angle ) * $.gravity * 15;
	this.vy += Math.sin( this.angle ) * $.gravity * 15;
}

/*==============================================================================
Crouch
==============================================================================*/
Alien.prototype.crouch = function( $ ) {
	sounds.push( new Sound({
		oscType: 3,
		freqStart: 600,
		freqEnd: 500,
		freqChange: 10
	}));
	this.vx -= Math.cos( this.angle ) * $.gravity * 2;
	this.vy -= Math.sin( this.angle ) * $.gravity * 2;
}

/*==============================================================================
Update
==============================================================================*/
Alien.prototype.update = function( $ ) {
	// basic movement updates
	this.vx += ( Math.cos( this.angle ) * -$.gravity ) * $.dt;
	this.vy += ( Math.sin( this.angle ) * -$.gravity ) * $.dt;
	this.x += this.vx * $.dt;
	this.y += this.vy * $.dt;
	this.dist = distance( this.x, this.y, $.moon.x, $.moon.y );
	this.oDistFromGround = this.distFromGround;	
	this.distFromGround = Math.max( 0, this.dist - $.moon.radius - this.radius + $.landOffset );

	// hit the ground
	if( this.distFromGround <= 0 ) {
		this.x = Math.cos( this.angle ) * ( $.moon.radius + this.radius - $.landOffset );
		this.y = Math.sin( this.angle ) * ( $.moon.radius + this.radius - $.landOffset );
		this.vx = ( -this.vx * 0.3 );
		this.vy = ( -this.vy * 0.3 );
		if( this.oDistFromGround != 0 ) {
			sounds.push( new Sound({
				oscType: 0,
				freqStart: 140,
				freqEnd: 100,
				freqChange: 4
			}));
		}
	}

	// hit the atmosphere
	if( this.distFromGround > $.moon.atmosphere ) {
		if( this.vy < 0 ) {
			this.vx = this.vx * 0.1;
			this.vy = this.vy * 0.1;
		}
	}

	// handle mousedown
	if( $.mousedown ) {
		this.vx += Math.cos( this.angle ) * $.gravity * 1.5;
		this.vy += Math.sin( this.angle ) * $.gravity * 1.5;
	}

	//collision checks

};

/*==============================================================================
Render
==============================================================================*/
Alien.prototype.render = function( $ ) {
	//this.drawRadius = this.radius + Math.cos($.tick / 10) * 1;

	/*==============================================================================
	Shadow
	==============================================================================*/
	var radiusShadow = this.drawRadius + this.distFromGround  / 40; 
		xShadow = Math.cos( this.angle ) * ( $.moon.radius - $.landOffset ),
		yShadow = Math.sin( this.angle ) * ( $.moon.radius - $.landOffset );		
	$.ctxmg.save();
	$.ctxmg.translate( xShadow, yShadow );
	$.ctxmg.rotate( this.angle - Math.PI / 2 );
	$.ctxmg.scale( 1, 1 - ( ( $.moon.radius - $.landOffset ) / $.moon.radius ) * 0.9 );	
	fillCircle( $.ctxmg, 0, 0, radiusShadow, 'hsla(0, 0%, 0%, ' + ( 0.45 - this.distFromGround  / 1000 ) + ')' );
	$.ctxmg.restore();

	/*==============================================================================
	Rotation and Translation
	==============================================================================*/
	$.ctxmg.save();
	$.ctxmg.translate( this.x, this.y );
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
	$.ctxmg.rotate( this.rotation );*/

	/*==============================================================================
	Left Foot
	==============================================================================*/
	var	speedDivLeftFoot = ( $.mousedown ) ? 2 : ( this.distFromGround > 0 ) ? 10 : 5,
		radiusLeftFoot = this.drawRadius * 0.45;
		angleLeftFoot = ( Math.PI * 0.5 ) + Math.cos( $.tick / speedDivLeftFoot ) * 0.2;
		xLeftFoot = 0 + Math.cos( angleLeftFoot ) * ( this.drawRadius ),
		yLeftFoot = 0 + Math.sin( angleLeftFoot ) * ( this.drawRadius );		
	$.ctxmg.save();
	$.ctxmg.beginPath();
	$.ctxmg.translate( xLeftFoot, yLeftFoot );
	$.ctxmg.rotate( -0.15 );
	$.ctxmg.scale( 1, 0.25 );	
	fillCircle( $.ctxmg, 0, 0, radiusLeftFoot, this.fillStyle );
	strokeCircle( $.ctxmg, 0, 0, radiusLeftFoot + 2, '#fff', 4 );
	$.ctxmg.restore();
	
	/*==============================================================================
	Body
	==============================================================================*/
	fillCircle( $.ctxmg, 0, 0, this.drawRadius, this.fillStyle );
	strokeCircle( $.ctxmg, 0, 0, this.drawRadius + 1, '#fff', 2 );

	/*==============================================================================
	Eyeball
	==============================================================================*/
	//var posOffset = Math.min( Math.PI / 4, ( this.dist - $.moon.radius - this.radius + $.landOffset ) / 250 );
	var	radiusEyeball = this.drawRadius * 0.5; 
		xEyeball = 0 + Math.cos( -0.6 ) * ( this.drawRadius - radiusEyeball * 0.75 ),
		yEyeball = 0 + Math.sin( -0.6 ) * ( this.drawRadius - radiusEyeball * 0.75 );		
	fillCircle( $.ctxmg, xEyeball, yEyeball, radiusEyeball, '#fff' );

	/*==============================================================================
	Pupil
	==============================================================================*/
	var posOffset = Math.min( Math.PI / 4, this.distFromGround / 250 );
	var	radiusPupil = radiusEyeball * 0.5; 
		xPupil = xEyeball + Math.cos( posOffset ) * ( radiusEyeball - radiusPupil * 1.2 ),
		yPupil = yEyeball + Math.sin( posOffset ) * ( radiusEyeball - radiusPupil * 1.2 );		
	fillCircle( $.ctxmg, xPupil, yPupil, radiusPupil, '#222' );

	/*==============================================================================
	Pupil Highlight
	==============================================================================*/
	var	radiusPupilHighlight = radiusPupil * 0.2; 
		xPupilHighlight = xPupil + Math.cos( -1.8 ) * ( radiusPupil - radiusPupilHighlight * 2 ),
		yPupilHighlight = yPupil + Math.sin( -1.8 ) * ( radiusPupil - radiusPupilHighlight * 2 );		
	fillCircle( $.ctxmg, xPupilHighlight, yPupilHighlight, radiusPupilHighlight, '#fff' );

	/*==============================================================================
	Mouth
	==============================================================================*/
	posOffset = Math.min( 0.25, this.distFromGround / 250 );
	var	radiusMouth = this.drawRadius * 0.35; 
		xMouth = 0 + Math.cos( 0.4 + ( posOffset * 0.3 ) ) * ( this.drawRadius ),
		yMouth = 0 + Math.sin( 0.4 + ( posOffset * 0.3 ) ) * ( this.drawRadius );		
	$.ctxmg.save();
	$.ctxmg.beginPath();
	$.ctxmg.arc( 0, 0, this.drawRadius, 0, Math.PI * 2 );
	$.ctxmg.clip();
	$.ctxmg.translate( xMouth, yMouth );
	$.ctxmg.rotate( -0.1 );
	$.ctxmg.scale( 1 + posOffset, 0.25 + posOffset );	
	fillCircle( $.ctxmg, 0, 0, radiusMouth, '#b51' );
	$.ctxmg.restore();

	/*==============================================================================
	Spots
	==============================================================================*/
	var	radiusSpot1 = this.drawRadius * 0.12; 
		xSpot1 = 0 + Math.cos( -Math.PI * 0.75 ) * ( this.drawRadius * 0.7 ),
		ySpot1 = 0 + Math.sin( -Math.PI * 0.75 ) * ( this.drawRadius * 0.7 );		
	$.ctxmg.save();
	$.ctxmg.translate( xSpot1, ySpot1 );
	$.ctxmg.rotate( -Math.PI / 4 );
	$.ctxmg.scale( 1, 0.5 );	
	fillCircle( $.ctxmg, 0, 0, radiusSpot1, '#fb5' );
	$.ctxmg.restore();

	var	radiusSpot2 = this.drawRadius * 0.2; 
		xSpot2 = 0 + Math.cos( -Math.PI * 0.75 ) * ( this.drawRadius * 0.47 ),
		ySpot2 = 0 + Math.sin( -Math.PI * 0.75 ) * ( this.drawRadius * 0.47 );		
	$.ctxmg.save();
	$.ctxmg.translate( xSpot2, ySpot2 );
	$.ctxmg.rotate( -Math.PI / 4 );
	$.ctxmg.scale( 1, 0.5 );	
	fillCircle( $.ctxmg, 0, 0, radiusSpot2, '#fb5' );
	$.ctxmg.restore();

	/*==============================================================================
	Right Foot
	==============================================================================*/
	var	speedDivRightFoot = ( $.mousedown ) ? 2 : ( this.distFromGround > 0 ) ? 10 : 5,
		radiusRightFoot = this.drawRadius * 0.45;
		angleRightFoot = ( Math.PI * 0.5 ) + Math.cos( $.tick / speedDivRightFoot ) * -0.2;
		xRightFoot = 0 + Math.cos( angleRightFoot ) * ( this.drawRadius ),
		yRightFoot = 0 + Math.sin( angleRightFoot ) * ( this.drawRadius );		
	$.ctxmg.save();
	$.ctxmg.beginPath();
	$.ctxmg.translate( xRightFoot, yRightFoot );
	$.ctxmg.rotate( -0.15 );
	$.ctxmg.scale( 1, 0.25 );	
	fillCircle( $.ctxmg, 0, 0, radiusRightFoot, this.fillStyle );
	strokeCircle( $.ctxmg, 0, 0, radiusRightFoot + 2, '#fff', 4 );
	$.ctxmg.restore();

	/*==============================================================================
	Force Field
	==============================================================================*/
	//fillCircle( $.ctxmg, 0, 0, this.radius * 2, 'hsla(190, 100%, 50%, 0.2)' );
	//strokeCircle( $.ctxmg, 0, 0, this.radius * 2 + 2, 'hsla(190, 100%, 90%, 0.5)', 4 );

	$.ctxmg.restore();
};