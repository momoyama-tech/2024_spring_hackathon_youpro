/*---------------------------------------------------
	スポットの位置情報

	2024.02.23 大西 智持
---------------------------------------------------*/

const headers = new Headers();
headers.append('Access-Control-Allow-Origin','*');

function Storage()
{
	const keyName = 'oshikatsu';
	let json = localStorage.getItem(keyName);
	let locations = null;

	console.log( json );

	if( json == null )
	{
		//34.45146816860581, 135.4572600663935
		//{"spotName":"京阪石山駅","lat":34.979521640749276,"lon":135.90002758500404},
		//{"spotName":"京都水族館","lat":34.987637941496764,"lon":135.74758093920548},
		//34.44982425416134, 135.45585005896456
		json = `[
			{"spotName":"京阪石山駅","lat":34.979521640749276,"lon":135.90002758500404},
			{"spotName":"京都水族館","lat":34.987637941496764,"lon":135.74758093920548},
			{"spotName":"瀬田川大橋","lat":34.97812629482221, "lon":135.90797237149633},
			{"spotName":"旧鎌掛小学校","lat":34.98880428098103,"lon":136.25994043078978},
			{"spotName":"御坊市","lat":33.88660020672323,"lon":135.1530207444247},
			{"spotName":"武装商店","lat":35.701690722392776,"lon":139.77134019717042},
			{"spotName":"龍飛埼灯台","lat":41.25842262484669,"lon":140.34256085639856},
			{"spotName":"鹿児島本港","lat":31.59312430839038,"lon":130.56416448145882},
			{"spotName":"吉野ケ里遺跡","lat":33.323654500444185,"lon":130.38623975439447},
			{"spotName":"一里山公園","lat":34.98485891650735,"lon":135.93514655891045}
		]`;

		localStorage.setItem(keyName ,json);
	}
	
	locations = JSON.parse(json);

	this.save = ()=>{
		localStorage.setItem(keyName , JSON.stringify(locations) );
	};

	this.catch = function( index ){
		locations[index]['isCatch'] = true;
		localStorage.setItem(keyName , JSON.stringify(locations) );
	};

	this.isCatch = function( index ){
		if( typeof locations[index]['isCatch'] === 'undefined' ) return false;
		return locations[index]['isCatch'];
	};

	Object.defineProperty(this,'locations',{
		get:function(){
			return locations;
		}
	});

}