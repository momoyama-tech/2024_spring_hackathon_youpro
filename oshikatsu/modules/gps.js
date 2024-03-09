/*---------------------------------------------------
	GPSライブラリ

	2024.02.23 大西 智持
---------------------------------------------------*/

const headers = new Headers();
headers.append('Access-Control-Allow-Origin','*');

export default function GPS(callback = null)
{
	// ブラウザの言語でメッセージを変化予定（現状日本語のみ）
	if( navigator?.geolocation?.watchPosition == null ) throw new Error('お使いのブラウザではGPSが使用できません');

	let positionId = null;
	this.onPositionUpdate = callback;
	this.onGeolocationError = function( e ){
		console.error( e );
	};

	// 内部用関数：度数からラジアンへ変換
	function toRad(deg){
		return deg * ( Math.PI / 180 );
	}

	// ２点間の距離計測用
	const poleRadius = 6356752.314245;// 極半径
	const equatorRadius = 6378137.0;  // 赤道の半径		
	const e2 = (Math.pow(equatorRadius,2) - Math.pow(poleRadius,2) ) / Math.pow(equatorRadius,2);// 第１離心率

	// ２つの緯度,経度から距離をKmで求める
	this.getDistance = function(pos1,pos2){

		const lat1 = toRad(pos1.latitude);
		const lon1 = toRad(pos1.longitude);

		const lat2 = toRad(pos2.latitude);
		const lon2 = toRad(pos2.longitude);
		
		const latDiff = lat1 - lat2; // 緯度差分
		const lonDiff = lon1 - lon2; // 経度差分
		const latAvg = (lat1 + lat2) / 2;// 緯度平均

		const w = Math.sqrt( 1 - e2 * Math.pow( Math.sin(latAvg) , 2 ) );			
		const m = equatorRadius * (1 - e2) / Math.pow(w , 3);// 子午線曲率半径			
		const n = equatorRadius / w;// 卯酉線曲半径

		const distance = Math.sqrt( Math.pow(m * latDiff , 2) + Math.pow( n * lonDiff * Math.cos(latAvg) , 2 ) );

		return distance / 1000;
	};

	// ２つの緯度,経度の方位を求める
	// 0:北 90:東 180:南 270:西		
	this.getDirection = function(pos1,pos2)
	{
		const lat1 = toRad(pos1.latitude);
		const lon1 = toRad(pos1.longitude);

		const lat2 = toRad(pos2.latitude);
		const lon2 = toRad(pos2.longitude);

		// 緯度経度 lat1, lng1 の点を出発として、緯度経度 lat2, lng2 への方位
		// 北を０度で右回りの角度０～３６０度
		const Y = Math.cos(lon2) * Math.sin(lat2 - lat1);
		const X = Math.cos(lon1) * Math.sin(lon2) - Math.sin(lon1) * Math.cos(lon2) * Math.cos(lat2 - lat1);

		let dirE0 = 180 * Math.atan2(Y, X) / Math.PI; // 東向きが０度の方向
		if (dirE0 < 0) {
			dirE0 = dirE0 + 360; //0～360 にする。
		}
		return (dirE0 + 90) % 360;//(dirE0+90)÷360の余りを出力 北向きが０度の方向
	}	

	// 位置情報取得の開始
	this.start = function(){

		positionId = navigator.geolocation.watchPosition((pos)=>{
			// 位置情報の取得に成功
			this.onPositionUpdate?.( pos.coords );

		},(e)=>{
			// 位置情報取得に失敗
			this.onGeolocationError( e );
		});

	};
	
	// 位置情報取得の停止
	this.stop = function(){

		if(positionId){
			navigator.geolocation.clearWatch(positionId);
			positionId = null;			
		}

	};

	// 計測中であればtrueを返す
	Object.defineProperty(this,'isWatch',{
		get:function(){
			return ( positionId ) ? true : false;
		}
	});
}