/*==============================================================================
Init
==============================================================================*/
function Moon( game ) {	
	this.x = 0;
	this.y = 0;
	this.radius = 2500;
	this.atmosphere = 800;
	this.rotation = 0;
	this.lineWidth = 50;
	this.fillStyle = '#eee';
	this.strokeStyle = 'hsla(0, 0%, 100%, 0.05)';

	//this.cache = document.createElement( 'canvas' );
	//this.ctx = this.cache.getContext( '2d' );
	//this.cache.width = this.cache.height = this.radius * 2;

	this.craters = [];
	var i = 150;
	while( i ) {
		var crater = {};
		crater.radius = rand( 20, 120 );
		crater.angle = rand( 0, Math.PI * 2 );
		crater.dist = this.radius - rand( 0, this.radius * 1 );
		crater.x = Math.cos( crater.angle ) * ( crater.dist ),
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

	/*==============================================================================
	Main Circle
	==============================================================================*/
	//fillCircle( this.ctx, this.radius, this.radius, this.radius, this.fillStyle );

	/*==============================================================================
	Rotation
	==============================================================================*/
	//this.ctx.save();
	//this.ctx.translate( this.radius, this.radius );
	//this.ctx.rotate( this.rotation );

	/*==============================================================================
	Craters
	==============================================================================*/
	/*var i = this.craters.length;
	while( i-- ) {
		crater = this.craters[ i ];

		this.ctx.save();
		this.ctx.translate( crater.x - Math.cos( crater.angle ) * ( crater.radius * 0.05 ), crater.y - Math.sin( crater.angle ) * ( crater.radius * 0.05 ) );
		this.ctx.rotate( crater.angle - Math.PI / 2 );
		this.ctx.scale( 1, 1 - ( crater.dist / this.radius ) * 0.9 );	
		fillCircle( this.ctx, 0, 0, crater.radius * 1.1, '#ccc' );
		this.ctx.restore();

		this.ctx.save();
		this.ctx.translate( crater.x, crater.y );
		this.ctx.rotate( crater.angle - Math.PI / 2 );
		this.ctx.scale( 1, 1 - ( crater.dist / this.radius ) * 0.9 );	
		fillCircle( this.ctx, 0, 0, crater.radius * 1.05, '#fff' );
		this.ctx.restore();

		this.ctx.save();
		this.ctx.translate( crater.x, crater.y );
		this.ctx.rotate( crater.angle - Math.PI / 2 );
		this.ctx.scale( 1, 1 - ( crater.dist / this.radius ) * 0.9 );	
		fillCircle( this.ctx, 0, 0, crater.radius, '#ddd' );
		this.ctx.restore();		
	}*/

	/*==============================================================================
	Restore
	==============================================================================*/
	//this.ctx.restore();

	//game.wrap.appendChild( this.cache);
}

/*==============================================================================
Update
==============================================================================*/
Moon.prototype.update = function( game ) {
	this.rotation -= 0.003 * game.dt;
};

/*==============================================================================
Render
==============================================================================*/
Moon.prototype.render = function( game ) {
	/*game.ctxmg.save();
	game.ctxmg.translate( 0, 0 );
	game.ctxmg.rotate( this.rotation );
	game.ctxmg.drawImage( this.cache, 0, 0, this.radius * 2, this.radius * 2, -this.radius, -this.radius, this.radius * 2, this.radius * 2 );
	game.ctxmg.restore();*/

	/*==============================================================================
	Atmosphere
	==============================================================================*/
	var gradient = game.ctxmg.createRadialGradient( 0, 0, 0, 0, 0, this.radius + this.atmosphere );
	gradient.addColorStop( 0.85, 'hsla(0, 0%, 100%, 0)' );
	gradient.addColorStop( 1, 'hsla(0, 0%, 100%, 0.1)' );
	fillCircle( game.ctxmg, this.x, this.y, this.radius + this.atmosphere, gradient );
	strokeCircle( game.ctxmg, this.x, this.y, this.radius + this.atmosphere + 5, 'hsla(0, 0%, 100%, 0.2)', 10 );

	/*==============================================================================
	Main Circle
	==============================================================================*/
	fillCircle( game.ctxmg, this.x, this.y, this.radius, this.fillStyle );

	/*==============================================================================
	Rotation
	==============================================================================*/
	game.ctxmg.save();
	game.ctxmg.translate( 0, 0 );
	game.ctxmg.rotate( this.rotation );

	/*==============================================================================
	Craters
	==============================================================================*/
	var i = this.craters.length;
	while( i-- ) {
		crater = this.craters[ i ];

		game.ctxmg.save();
		game.ctxmg.translate( crater.x - Math.cos( crater.angle ) * ( crater.radius * 0.05 ), crater.y - Math.sin( crater.angle ) * ( crater.radius * 0.05 ) );
		game.ctxmg.rotate( crater.angle - Math.PI / 2 );
		game.ctxmg.scale( 1, 1 - ( crater.dist / this.radius ) * 0.9 );	
		fillCircle( game.ctxmg, 0, 0, crater.radius * 1.1, '#ccc' );
		game.ctxmg.restore();

		game.ctxmg.save();
		game.ctxmg.translate( crater.x, crater.y );
		game.ctxmg.rotate( crater.angle - Math.PI / 2 );
		game.ctxmg.scale( 1, 1 - ( crater.dist / this.radius ) * 0.9 );	
		fillCircle( game.ctxmg, 0, 0, crater.radius * 1.05, '#fff' );
		game.ctxmg.restore();

		game.ctxmg.save();
		game.ctxmg.translate( crater.x, crater.y );
		game.ctxmg.rotate( crater.angle - Math.PI / 2 );
		game.ctxmg.scale( 1, 1 - ( crater.dist / this.radius ) * 0.9 );	
		fillCircle( game.ctxmg, 0, 0, crater.radius, '#ddd' );
		game.ctxmg.restore();		
	}

	/*==============================================================================
	Restore
	==============================================================================*/
	game.ctxmg.restore();

};