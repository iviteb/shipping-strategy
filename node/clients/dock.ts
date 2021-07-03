import { 
  InstanceOptions, 
  IOContext, 
  JanusClient, 
  RequestConfig 
} from '@vtex/api'
import { pipe } from 'ramda'
import { statusToError } from '../utils'

const TWO_SECONDS = 2 * 1000

const withCookieAsHeader =
  (context: IOContext) =>
  (options: InstanceOptions): InstanceOptions => ({
    ...options,
    headers: {
      VtexIdclientAutCookie: context.adminUserAuthToken ?? '',
      ...(options?.headers ?? {}),
    },
    timeout: TWO_SECONDS
  })

export default class Docks extends JanusClient {
  constructor(context: IOContext, options?: InstanceOptions) {
    super(context, options && pipe(withCookieAsHeader(context))(options))
  }

  public async listAllDocks(): Promise<string> {
    return this.get(this.routes.docks)
  }

  protected get = <T>(url: string, config?: RequestConfig) =>
    this.http.get<T>(url, config).catch(statusToError) as Promise<T>

  private get routes() {
    const basePVT = '/api/logistics'

    return {
      docks: `${basePVT}/pvt/configuration/docks` 
    }
  }
}