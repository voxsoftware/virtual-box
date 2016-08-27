var Vbox=core.org.voxsoftware.VirtualBox
class SharedFolder{

	constructor(info){
		this.info= info||{}
	}

	get name(){
		return this.info.name
	}

	get path(){
		return this.info.path
	}

	get isTransient(){
		return this.info.transient
	}

	get isMachine(){
		return !this.info.transient
	}

	get automount(){
		return this.info.automount
	}
	get readonly(){
		return this.info.readonly
	}


	set name(val){
		this.info.name= val
	}
	set path(val){
		this.info.path= val
	}
	set isTransient(val){
		this.info.transient= val
	}
	set isMachine(val){
		this.info.transient=!val
	}
	set automount(val){
		this.info.automount=val
	}
	set readonly(val){
		this.info.readonly= val
	}

	async remove(){
		var manager= this.parent.machine.manager
		var args= ["sharedfolder", "remove", this.parent.machine.name, "--name", this.name]
		if(this.isTransient)
			args.push("--transient")
		await manager.command(args)
		for(var i=this.index;i<this.parent.length;i++){
			if(i>0)
				this.parent[i-1]= this.parent[i]
		}
		this.parent.pop()
	}

}
export default SharedFolder