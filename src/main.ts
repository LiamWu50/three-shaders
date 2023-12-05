import './styles/index.css'

import App from './modules/waves/app'
import ThreeSceneCreator from './modules/waves/lib/three-scene-creator'

const initScene = () => {
  const container = document.getElementById('container')

  ThreeSceneCreator.init(container as HTMLDivElement)
  const { scene, camera, renderer, size } = ThreeSceneCreator

  const app = new App(scene, camera, renderer, size)
  app.init()
}

initScene()
