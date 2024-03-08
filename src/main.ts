import './styles/index.css'

import ThreeSceneCreator from './modules/vertex-color/lib/three-scene-creator'

const initScene = () => {
  const container = document.getElementById('container')
  ThreeSceneCreator.init(container as HTMLDivElement)
}

initScene()
