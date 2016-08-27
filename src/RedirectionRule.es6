var Vbox= core.org.voxsoftware.VirtualBox

class RedirectionRule{
	constructor(info){
		this.info= info||{}
	}

	get isIpv6(){
		return this.info.ipv6
	}

	get name(){
		return this.info.name
	}

	get type(){
		return this.info.type
	}

	get hostIp(){
		return this.info.hostIp
	}

	get hostPort(){
		return this.info.hostPort
	}

	get guestIp(){
		return this.info.guestIp
	}

	get guestPort(){
		return this.info.guestPort
	}

	set name(val){
		return this.info.name=val
	}

	set type(val){
		return this.info.type=val
	}

	set hostIp(val){
		return this.info.hostIp=val
	}

	set hostPort(val){
		return this.info.hostPort=val
	}

	set guestIp(val){
		return this.info.guestIp=val
	}

	set guestPort(val){
		return this.info.guestPort=val
	}

	set isIpv6(val){
		return this.info.ipv6= val
	}
	

	toVirtualBoxString(){
		return [this.name, this.type, "["+this.hostIp+"]",
			this.hostPort, "[" + this.guestIp + "]", this.guestPort].join(":")
	}
}
export default RedirectionRule