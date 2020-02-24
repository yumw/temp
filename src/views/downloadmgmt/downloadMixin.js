import { getToken } from '@/utils/auth'
import { downloadFile } from '@/utils/download'
import axios from 'axios'
export default {
  methods: {
    download(item) {
      // GET request for remote image
      const params = {
        id: item.id,
        channelCode: item.channelCode
      }
      const token = getToken()
      axios({
        method: 'post',
        headers: { 'token': token },
        baseURL: process.env.BASE_API,
        url: '/file/download',
        data: params,
        responseType: 'blob'
      })
        .then(function(response) {
          downloadFile(response.data, item.fileNameOuput || item.fileName)
        }).catch(error => {
          console.log(error)
        })
    }
  }
}
