(function () {
  var images = document.getElementsByTagName("img"); // ページ内の画像取得
  var percent = document.getElementById("percent-text"); // パーセントのテキスト部分
  var gauge = document.getElementById("gauge"); // ゲージ
  var loadingBg = document.getElementById("loadingBg"); // ローディング背景
  var loading = document.getElementById("loading"); // ローディング要素
  var count = 0;
  var gaugeMax = 400; // ゲージの幅指定
  var current;

  let stage = document.getElementById("stage");

  let scene;
  // let sphere;
  let sphereEarth;
  let sphereCrowd; // 追加
  let sphereUniverse; // 追加
  let camera;
  let renderer;
  let light;
  let ambient; // 追加
  let gridHelper; // 追加
  let axisHelper; // 追加
  let lightHelper; // 追加
  let width = window.innerWidth;
  let height = window.innerHeight;
  let loader;
  let theta = 0; // 追加
  let theta_y = 0; // 追加
  let controls; // 追加

  // テクスチャー
  let textureSun;
  let textureMercury;
  let textureVenus;
  let textureEarth;
  let textureCrowd;
  let textureMars;
  let textureJupiter;
  let textureSaturn;
  let textureSaturnRing;
  let textureOuranos;
  let textureOuranosRing;
  let texturePluto;
  let textureNeptune;
  let textureUniverse;

  // オブジェクト
  let sun;
  let mercury;
  let venus;
  let earth;
  let crowd;
  let mars;
  let jupiter;
  let saturn;
  let saturnRing;
  let ouranos;
  let ouranosRing;
  let pluto;
  let neptune;
  let universe;

  stage.style.display = "none";

  // y軸
  let rad = -3000;

  // スタートボタン
  let isStart = false;

  // ステージを作る
  scene = new THREE.Scene();

  // 読み込むテクスチャーリスト
  let manifest = [
    {
      id: "sun",
      src: "./script/threejs/sun.jpg",
    }, // 水星
    {
      id: "mercury",
      src: "./script/threejsmercury.jpg",
    }, // 水星
    {
      id: "venus",
      src: "./script/threejsvenus.jpg",
    }, // 金星
    {
      id: "earth",
      src: "./script/threejsearth.png",
    }, // 地球
    {
      id: "crowd",
      src: "./script/threejscrowd.png",
    }, // 雲
    {
      id: "mars",
      src: "./script/threejsmars.jpg",
    }, // 火星
    {
      id: "jupiter",
      src: "./script/threejsjupiter.jpg",
    }, // 木星
    {
      id: "saturn",
      src: "./script/threejssaturn.jpg",
    }, // 土星
    {
      id: "saturn-ring",
      src: "./script/threejssaturn-ring.jpg",
    }, // 土星の輪
    {
      id: "ouranos",
      src: "./script/threejsouranos.jpg",
    }, // 天王星
    {
      id: "ouranos-ring",
      src: "./script/threejsouranos-ring.jpg",
    }, // 天王星の輪
    {
      id: "pluto",
      src: "./script/threejspluto.jpg",
    }, // 冥王星
    {
      id: "neptune",
      src: "./script/threejsneptune.jpg",
    }, // 海王星
    {
      id: "universe",
      src: "./script/threejsuniverse.jpg",
    }, // 宇宙空間
  ];

  // ロードキューを作成
  let loadQueue = new createjs.LoadQueue();
  // 並列での読み込み数を設定
  loadQueue.setMaxConnections(14);
  // 読み込みの進行状況が変化した
  loadQueue.addEventListener("progress", handleProgress);
  // 1つのファイルを読み込み終わったら
  loadQueue.addEventListener("fileload", handleFileLoadComplete);
  // 全てのファイルを読み込み終わったら
  loadQueue.addEventListener("complete", handleComplete);

  // ロード官僚w監視
  loadQueue.on("complete", function () {
    // ロードした画像を取得
    // loadQueueからロードした画像データを取得
    let sunImg = loadQueue.getResult("sun");
    let mercuryImg = loadQueue.getResult("mercury");
    let venusImg = loadQueue.getResult("venus");
    let earthImg = loadQueue.getResult("earth");
    let crowdImg = loadQueue.getResult("crowd");
    let marsImg = loadQueue.getResult("mars");
    let jupiterImg = loadQueue.getResult("jupiter");
    let saturnImg = loadQueue.getResult("saturn");
    let saturnRingImg = loadQueue.getResult("saturn-ring");
    let ouranosImg = loadQueue.getResult("ouranos");
    let ouranosRingImg = loadQueue.getResult("ouranos-ring");
    let plutoImg = loadQueue.getResult("pluto");
    let neptuneImg = loadQueue.getResult("neptune");
    let universeImg = loadQueue.getResult("universe");

    // three.jsで使えるテクスチャーに変換
    textureSun = new THREE.Texture(sunImg);
    textureMercury = new THREE.Texture(mercuryImg);
    textureVenus = new THREE.Texture(venusImg);
    textureEarth = new THREE.Texture(earthImg);
    textureCrowd = new THREE.Texture(crowdImg);
    textureMars = new THREE.Texture(marsImg);
    textureJupiter = new THREE.Texture(jupiterImg);
    textureSaturn = new THREE.Texture(saturnImg);
    textureSaturnRing = new THREE.Texture(saturnRingImg);
    textureOuranos = new THREE.Texture(ouranosImg);
    textureOuranosRing = new THREE.Texture(ouranosRingImg);
    texturePluto = new THREE.Texture(plutoImg);
    textureNeptune = new THREE.Texture(neptuneImg);
    textureUniverse = new THREE.Texture(universeImg);

    // 【重要】更新を許可
    textureSun.needsUpdate = true;
    textureMercury.needsUpdate = true;
    textureVenus.needsUpdate = true;
    textureEarth.needsUpdate = true;
    textureCrowd.needsUpdate = true;
    textureMars.needsUpdate = true;
    textureJupiter.needsUpdate = true;
    textureSaturn.needsUpdate = true;
    textureSaturnRing.needsUpdate = true;
    textureOuranos.needsUpdate = true;
    textureOuranosRing.needsUpdate = true;
    texturePluto.needsUpdate = true;
    textureNeptune.needsUpdate = true;
    textureUniverse.needsUpdate = true;

    sun = planetFactory(textureSun, 50, 20, 20, "isSun");
    mercury = planetFactory(textureMercury, 5, 20, 20);
    venus = planetFactory(textureVenus, 10, 20, 20);
    earth = planetFactory(textureEarth, 13, 20, 20, "isEarth");
    mars = planetFactory(textureMars, 7, 20, 20);
    jupiter = planetFactory(textureJupiter, 30, 20, 20);
    saturn = planetFactory(textureSaturn, 18, 20, 20, "isSaturn");
    ouranos = planetFactory(textureOuranos, 20, 20, 20, "isOuranos");
    pluto = planetFactory(texturePluto, 18, 20, 20);
    neptune = planetFactory(textureNeptune, 17, 20, 20);
    universe = planetFactory(textureUniverse, 950, 20, 20, "isUniverse");

    render();
  });

  loadQueue.loadManifest(manifest);

  // 点光源
  light = new THREE.PointLight(0xffffff, 3, 0);
  light.position.set(0, 0, 0);
  light.castShadow = true;
  light.shadow.camera.left = -200;
  light.shadow.camera.right = 200;
  light.shadow.camera.top = 200;
  light.shadow.camera.bottom = -200;

  scene.add(light);

  // 環境光源を作る
  ambient = new THREE.AmbientLight(0x222222);
  scene.add(ambient);

  // camera
  camera = new THREE.PerspectiveCamera(60, width / height, 1, 1000000); // あとでOrthographicCamera
  // camera.position.set(400, rad, 300);
  camera.position.set(400, -3200, 300);
  camera.lookAt(scene.position);

  // helper
  // gridHelper = new THREE.GridHelper(200, 20);
  // scene.add(gridHelper);
  // axisHelper = new THREE.AxisHelper(1000);
  // scene.add(axisHelper);
  // // lightHelper = new THREE.DirectionalLightHelper(light, 20);
  // // scene.add(lightHelper);
  // lightHelper = new THREE.PointLightHelper(light, 20);
  // scene.add(lightHelper);
  // shadowHelper = new THREE.CameraHelper(light.shadow.camera);
  // scene.add(shadowHelper);

  // OrbitControls.js のcontrols
  controls = new THREE.OrbitControls(camera);
  controls.minDistance = 0;
  controls.maxDistance = 9900;
  controls.enableDamping = true;
  controls.dampingFactor = 0.2;

  // レンダラ
  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(width, height);
  renderer.setClearColor(0xefefef);
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.shadowMap.enabled = true;
  document.getElementById("stage").appendChild(renderer.domElement);

  function planetFactory(
    texture,
    radius,
    widthSegments,
    heightSegments,
    planetName
  ) {
    let sphere, sphereEarth, ring;

    if (planetName === "isSun") {
      sphere = new THREE.Mesh(
        new THREE.SphereGeometry(radius, widthSegments, heightSegments),
        new THREE.MeshBasicMaterial({
          map: texture,
          side: THREE.DoubleSide,
        })
      );
      sphere.position.set(0, 0, 0);
    } else if (planetName === "isEarth") {
      sphere = new THREE.Group();

      sphereEarth = new THREE.Mesh(
        new THREE.SphereGeometry(13, 20, 20),
        new THREE.MeshLambertMaterial({
          map: texture,
        })
      );

      crowd = new THREE.Mesh(
        new THREE.SphereGeometry(14, 20, 20),
        new THREE.MeshLambertMaterial({
          map: textureCrowd,
          transparent: true,
          side: THREE.DoubleSide,
        })
      );
      sphere.add(sphereEarth);
      sphere.add(crowd);

      sphere.position.set(
        Math.random() * 500 - 250,
        Math.random() * 500 - 250,
        Math.random() * 500 - 250
      );
      sphere.castShadow = true;
      sphere.receiveShadow = true;
    } else if (planetName === "isSaturn") {
      sphere = new THREE.Group();

      spherePlanet = new THREE.Mesh(
        new THREE.SphereGeometry(radius, widthSegments, heightSegments),
        new THREE.MeshLambertMaterial({
          // 材質
          map: texture,
        })
      );

      // 輪を作る
      ring = new THREE.Mesh(
        new THREE.TorusGeometry(radius + 9, 5, 2, 1000), // 芯円半径、断面円半径、断面円分割、芯円分割
        new THREE.MeshPhongMaterial({
          // 材質
          map: texture,
          opacity: 0.7,
          transparent: true,
        })
      );

      ring.rotation.x = 1.5;

      sphere.add(spherePlanet);
      sphere.add(ring);

      sphere.position.set(
        Math.random() * 500 - 250,
        Math.random() * 500 - 250,
        Math.random() * 500 - 250
      );
    } else if (planetName === "isOuranos") {
      sphere = new THREE.Group();

      spherePlanet = new THREE.Mesh(
        new THREE.SphereGeometry(radius, widthSegments, heightSegments),
        new THREE.MeshLambertMaterial({
          // 材質
          map: texture,
        })
      );

      // 輪を作る
      ring = new THREE.Mesh(
        new THREE.TorusGeometry(radius + 5, 2, 2, 1000), // 芯円半径、断面円半径、断面円分割、芯円分割
        new THREE.MeshPhongMaterial({
          // 材質
          map: texture,
          opacity: 0.7,
          transparent: true,
        })
      );

      ring.rotation.x = 1.5;

      sphere.add(spherePlanet);
      sphere.add(ring);

      sphere.position.set(
        Math.random() * 500 - 250,
        Math.random() * 500 - 250,
        Math.random() * 500 - 250
      );
    } else if (planetName === "isUniverse") {
      sphere = new THREE.Mesh(
        new THREE.SphereGeometry(radius, widthSegments, heightSegments),
        new THREE.MeshLambertMaterial({
          // color: 0x444444,
          map: texture,
          side: THREE.DoubleSide,
        })
      );

      sphere.position.set(0, 0, 0);
      sphere.receiveShadow = false;
    } else {
      sphere = new THREE.Mesh(
        new THREE.SphereGeometry(radius, widthSegments, heightSegments),
        new THREE.MeshLambertMaterial({
          map: texture,
        })
      );

      sphere.position.set(
        Math.random() * 500 - 250,
        Math.random() * 500 - 250,
        Math.random() * 500 - 250
      );
      sphere.castShadow = true;
      sphere.receiveShadow = true;
    }
    scene.add(sphere);
    return sphere;
  }

  function ringFactory(
    texture,
    radius,
    tube,
    radialSegments,
    tubularSegments,
    x,
    y,
    z
  ) {
    let ring;

    ring = new THREE.Mesh(
      new THREE.TorusGeometry(radius, tube, radialSegments, tubularSegments),
      new THREE.MeshPhongMaterial({
        map: texture,
        opacity: 0.7,
        transparent: true,
      })
    );
    ring.position.set(x, y, z);
    ring.rotation.x = 0.8;

    scene.add(ring);
    return ring;
  }

  function render() {
    requestAnimationFrame(render);

    mercury.rotation.y += 0.005; // 追加：水星を回転させる
    venus.rotation.y += 0.001; // 追加：金星を回転させる
    earth.rotation.y += 0.0005; // 追加：地球を回転させる
    crowd.rotation.y += 0.001; // 追加：雲を回転させる
    mars.rotation.y += 0.002; // 追加：火星を回転させる
    jupiter.rotation.y += 0.003; // 追加：木星を回転させる
    saturn.rotation.y += 0.004; // 追加：土星を回転させる
    ouranos.rotation.y += 0.005; // 追加：天王星を回転させる
    pluto.rotation.y += 0.006; // 追加：冥王星を回転させる
    neptune.rotation.y += 0.007; // 追加：海王星を回転させる

    theta += 0.1;
    camera.position.x = Math.cos(THREE.Math.degToRad(theta)) * 300; // 追加

    if (isStart) {
      if (rad < -1000) {
        rad += Math.cos(THREE.Math.degToRad(theta_y)) * 20;
      } else if (-1000 <= rad && rad < 200) {
        rad += Math.cos(THREE.Math.degToRad(theta_y)) * 5;
      } else {
        display_portforio();
      }

      camera.position.y = rad; // 追加;
    }

    camera.position.z = Math.sin(THREE.Math.degToRad(theta)) * 300; // 追加
    camera.lookAt(scene.position); // 追加

    controls.update();
    renderer.render(scene, camera);
  }

  // タイトルを押すと太陽系に移動する;
  let tech_name = document.getElementById("tech_name");
  tech_name.addEventListener("click", (event) => {
    isStart = true;
    tech_name.classList.remove("js-tech-name");
    tech_name.classList.add("js-tech-name_nohover");
  });

  function display_portforio() {
    let portforio = document.getElementById("portforio");
    portforio.style.display = "block";
  }

  async function handleProgress(event) {
    // 読み込み率を0.0~1.0で取得
    var progress = event.progress;

    // 現在の読み込み具合のパーセントを取得
    current = Math.floor(progress * 100);
    // パーセント表示の書き換え
    percent.innerHTML = current;
    // ゲージの変更
    gauge.style.width = Math.floor((gaugeMax / 100) * current) + "px";
    // 全て読み込んだ時
    if (current >= 100) {
      await wait(1); // ここで10秒間止まります
      // ローディング要素の非表示
      loadingBg.style.display = "none";
      loading.style.display = "none";
      // ローディングの終了
      // clearInterval(nowLoading);
      stage.style.display = "block";
    }
    console.log(current);
  }

  function handleFileLoadComplete(event) {
    // 読み込んだファイル
    var result = event.result;
    // console.log(result);
  }

  function handleComplete() {
    console.log("LOAD COMPLETE");
  }
})();

const wait = (sec) => {
  return new Promise((resolve, reject) => {
    setTimeout(resolve, sec * 1000);
    //setTimeout(() => {reject(new Error("エラー！"))}, sec*1000);
  });
};
