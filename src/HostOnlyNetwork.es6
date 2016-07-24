var Vbox= core.org.voxsoftware.VirtualBox
class HostOnlyNetwork extends Vbox.Network{
	

	get name(){
		return this.info.Name
	}

	get GUID(){
		return this.info.GUID
	}

	get IP(){
		return this.info.IPAddress
	}

	get networkMask(){
		return this.info.NetworkMask
	}

	get IPV6Address(){
		return this.info.IPV6Address
	}

	get IPV6NetworkMaskPrefixLength(){
		return this.info.IPV6NetworkMaskPrefixLength
	}

	get hardwareAddress(){
		return this.info.HardwareAddress
	}

	get mediumType(){
		return this.info.MediumType
	}

	get status(){
		return this.info.Status
	}

	get networkName(){
		return this.info.VBoxNetworkName
	}


	set IP(val){
		return this.info.IPAddress= val
	}

	set networkMask(val){
		return this.info.NetworkMask= val
	}

	

	async change(){
		var args= []
		//if(this.info.type=="host-only")
			args.push("hostonlyif")
		//else
		//	throw new core.System.ArgumentException("No se detectó el tipo de red")

		args.push("ipconfig")
		args.push(this.name)
		args.push("--ip")
		args.push(this.IP)
		args.push("--netmask")
		args.push(this.networkMask)
		await this.manager.command(args)
	}


}
export default HostOnlyNetwork