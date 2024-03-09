// ブラウザ画面の高さ基準値を設定
function setWindowHeightBasis(){
	const vh = window.innerHeight * 0.01;
	document.documentElement.style.setProperty('--vh', `${vh}px`);
}

// ブラウザ画面の高さを再計算
let vw = window.innerWidth;
window.addEventListener('resize', () => {
	if (vw === window.innerWidth) {				
		return;
	}
	vw = window.innerWidth;
	setWindowHeightBasis();
});

window.addEventListener('load',()=>{
	setWindowHeightBasis();
});

