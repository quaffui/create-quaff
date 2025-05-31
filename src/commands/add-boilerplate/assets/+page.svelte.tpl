<div class="q-page">
  <div class="row q-mb-lg">
    <div class="col-12">
      <h1>You've made it. 🍸</h1>
    </div>
  </div>
  <div class="row q-gutter-md">
    <div class="col-12">
      <p>Congrats, you've successfully installed Quaff! Below are a few components to play with.</p>
    </div>
    <div class="col-xs-12 col-md-6">
      <QInput value={''} label="Input field" outlined />
    </div>
    <div class="col-xs-12 col-md-6">
      <QSelect value={''} label="Select" options={['Option A', 'Option B']} outlined />
    </div>
    <div class="col-12 flex">
      <QCheckbox value={false} label="I agree that Quaff is awesome" class="q-mr-lg" />
      <QBtn label="Click me" outline />
    </div>
  </div>
</div>
