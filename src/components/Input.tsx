import { Component, Prop, Vue } from 'vue-property-decorator'

@Component
export default class Input extends Vue {
  @Prop() validate?: Function
  @Prop() type!: string
  @Prop() error!: boolean
  @Prop() value?: any
  render () {
    return (
      <input type={this.type}
        {...this.$props}
        value={this.value}
        onInput={(e: any) => this.$emit('input', e.target.value)}
        class={(this.error ? 'error' : '')}
        onBlur={() => this.validate && this.validate(this.value)} />
    )
  }
}
