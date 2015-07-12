# fritzapp

fritzapp is a little angular app that lists all your SmartHome devices registered with your FritzBox. Devices like the Fritz!Dect 200 can be switched on and off from within the app.

![fritzapp screenshot](https://raw.github.com/saesh/fritzapp/screenshots/screenshot1.png)

## Dependencies

All you need is [Vagrant](https://www.vagrantup.com) installed on your machine. Everything else happens in the Vagrant machine.

Oh, and a FritzBox and a SmartHome device like a Fritz!Dect 200.

## Usage

All you need to do is checkout this project and get going with these commands:

```
cd fritzapp
vagrant up
vagrant ssh
cd /vagrant
npm install
gulp watch-dev
```

In your local browser go to http://localhost:8080 and enter username and password of a valid FritzBox user capable of reading and controlling SmartHome devices.

## Acknowledgements

- gulp file and karma setup taken from [healthy-gulp-angular](https://github.com/paislee/healthy-gulp-angular)
- Logger taken from [angular-ny-logger](https://github.com/naorye/angular-ny-logger)

Thanks guys!