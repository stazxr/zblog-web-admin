import api from '../custom-axios'

const albumApi = '/api/albums'

export default {
  // 分页查询相册列表
  pageList: params => {
    return api.httpRequest().get(`${albumApi}/pageAlbumList`, params)
  },
  // 查询相册详情
  queryAlbumDetail: params => {
    return api.httpRequest().get(`${albumApi}/queryAlbumDetail`, params)
  },
  // 新增或编辑相册
  addOrEditAlbum: params => {
    return api.httpRequest().post(`${albumApi}/addOrEditAlbum`, params)
  },
  // 删除相册
  deleteAlbum: params => {
    return api.httpRequest().post(`${albumApi}/deleteAlbum`, params)
  },
  // 分页查询照片列表
  pagePhotoList: params => {
    return api.httpRequest().get(`${albumApi}/pagePhotoList`, params)
  },
  // 保存相册照片列表
  saveAlbumPhoto: params => {
    return api.httpRequest().post(`${albumApi}/saveAlbumPhoto`, params)
  },
  // 分页查询回收站照片列表
  pageRecycleList: params => {
    return api.httpRequest().get(`${albumApi}/pageRecycleList`, params)
  }
}
