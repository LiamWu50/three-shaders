import './styles/index.css'

import ThreeSceneCreator from './helpers/three-scene-creator'
import App from './modules/waves/app'

const initScene = () => {
  const container = document.getElementById('container')
  console.log('container', container)

  ThreeSceneCreator.init(container as HTMLDivElement)
  const { scene } = ThreeSceneCreator

  const app = new App(scene)
  app.init()
}

initScene()
