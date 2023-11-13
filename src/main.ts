import './styles/index.css'

import ThreeSceneCreator from './modules/waves/app'

const initScene = () => {
  const container = document.getElementById('container')
  console.log('container', container)

  ThreeSceneCreator.init(container as HTMLDivElement)
}

initScene()
