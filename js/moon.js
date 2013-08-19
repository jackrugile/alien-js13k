/*==============================================================================
Init
==============================================================================*/
function Moon( $ ) {	
	this.x = 0;
	this.y = 0;
	this.radius = 2500;
	this.atmosphere = 800;
	this.rotation = 0;
	this.rotationSpeed = 0.003;
	this.lineWidth = 50;
	this.fillStyle = '#eee';
	this.strokeStyle = 'hsla(0, 0%, 100%, 0.05)';

	this.craters = [];
	var i = 150;
	while( i ) {
		var crater = {};
		crater.radius = rand( 20, 120 );
		crater.angle = rand( 0, Math.PI * 2 );
		crater.dist = this.radius - rand( 0, this.radius * 1 );
		crater.x = Math.cos( crater.angle ) * ( crater.dist );
		crater.y = Math.sin( crater.angle ) * ( crater.dist );

		var j = this.craters.length,
			collision = false;
		if( j ) {
			while( j-- ) {
				var otherCrater = this.craters[ j ],
					dist = distance( crater.x, crater.y, otherCrater.x, otherCrater.y );
				if( dist < crater.radius + otherCrater.radius + 50 ){
					collision = true;
					break;
				}
			}
		}

		if( !collision ) {
			this.craters.push( crater );
			i--;
		}
	}
}

/*==============================================================================
Update
==============================================================================*/
Moon.prototype.update = function( $ ) {
	this.rotation -= this.rotationSpeed  * $.dt;
};

/*==============================================================================
Render
==============================================================================*/
Moon.prototype.render = function( $ ) {
	/*==============================================================================
	Atmosphere
	==============================================================================*/
	var gradient = $.ctxmg.createRadialGradient( 0, 0, 0, 0, 0, this.radius + this.atmosphere );
	gradient.addColorStop( 0.85, 'hsla(0, 0%, 100%, 0)' );
	gradient.addColorStop( 1, 'hsla(0, 0%, 100%, 0.1)' );
	fillCircle( $.ctxmg, this.x, this.y, this.radius + this.atmosphere, gradient );
	strokeCircle( $.ctxmg, this.x, this.y, this.radius + this.atmosphere + 5, 'hsla(0, 0%, 100%, 0.2)', 10 );

	/*==============================================================================
	Main Circle
	==============================================================================*/
	fillCircle( $.ctxmg, this.x, this.y, this.radius, this.fillStyle );

	/*==============================================================================
	Rotation
	==============================================================================*/
	$.ctxmg.save();
	$.ctxmg.translate( 0, 0 );
	$.ctxmg.rotate( this.rotation );

	/*==============================================================================
	Craters
	==============================================================================*/
	var i = this.craters.length;
	while( i-- ) {
		crater = this.craters[ i ];

		$.ctxmg.save();
		$.ctxmg.translate( crater.x - Math.cos( crater.angle ) * ( crater.radius * 0.05 ), crater.y - Math.sin( crater.angle ) * ( crater.radius * 0.05 ) );
		$.ctxmg.rotate( crater.angle - Math.PI / 2 );
		$.ctxmg.scale( 1, 1 - ( crater.dist / this.radius ) * 0.9 );	
		fillCircle( $.ctxmg, 0, 0, crater.radius * 1.1, '#ccc' );
		$.ctxmg.restore();

		$.ctxmg.save();
		$.ctxmg.translate( crater.x, crater.y );
		$.ctxmg.rotate( crater.angle - Math.PI / 2 );
		$.ctxmg.scale( 1, 1 - ( crater.dist / this.radius ) * 0.9 );	
		fillCircle( $.ctxmg, 0, 0, crater.radius * 1.05, '#fff' );
		$.ctxmg.restore();

		$.ctxmg.save();
		$.ctxmg.translate( crater.x, crater.y );
		$.ctxmg.rotate( crater.angle - Math.PI / 2 );
		$.ctxmg.scale( 1, 1 - ( crater.dist / this.radius ) * 0.9 );	
		fillCircle( $.ctxmg, 0, 0, crater.radius, '#ddd' );
		$.ctxmg.restore();
	}

	/*==============================================================================
	Restore
	==============================================================================*/
	$.ctxmg.restore();

};